// ======================
// DOM ELEMENTS
// ======================
const addPatientForm = document.querySelector("#addPatientForm");
const patientTableSearchInput = document.querySelector(
    "#patientTableSearchInput",
);
const statusFilter = document.querySelector("#statusFilter");
const genderFilter = document.querySelector("#genderFilter");
const tableBody = document.querySelector("#patientsTableBody");

// ======================
// APPLICATION STATE
// ======================
let allPatientsList = [];

// ======================
// 
// ======================
const BASE_URL = "http://localhost:3000/patients";

// ======================
// UTILITIES
// ======================
// Calculate patient age from date of birth
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
};

// Format date (year month day: Feb 10, 2025 )
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

// ======================
// API CALLS
// ======================
// Fetch all patients
const fetchPatients = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(
                "Failed to fetch patients, status:" + response.status,
            );
        }

        const patients = await response.json();
        const orderOfPatients = await patients.reverse();
        allPatientsList.push(...orderOfPatients);
        updateUI();
    } catch (error) {
        console.error("Error fetching patients:", error.message);
    }
};

// Create new patient
const postPatient = async (newPatientData) => {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPatientData),
        });
        if (!response.ok)
            throw new Error(
                "Failed to create patient, status: " + response.status,
            );
        const newPatient = await response.json();
        allPatientsList.unshift(newPatient);
        updateUI();
    } catch (error) {
        console.error("Error:", error.message);
    }
};



// Delete Patient
const deletePatient = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error(
                "Failed to delete patient, status: " + response.status,
            );

        return true;
    } catch (error) {
        console.error("Error deleting patient:" + error.message);
    }
};

/*
User edits form
   ↓
Call API (PUT/PATCH)
   ↓
Update local state (replace item)
   ↓
Re-run filters/search
   ↓
Re-render UI

*/

// ======================
// CONTROLLERS
// ======================
const handleView = (id) => {
    const patient = allPatientsList.find(p => p.id == id);

    if(patient){
        openViewModal(patient)
        
    }
};

const handleEdit = (id) => {
    console.log("chillllll-edit-ax!!!!");
};
const handleDelete = async (id) => {
    const patient = allPatientsList.find((p) => p.id === id);

    if (!patient) return;

    const confirmed = confirm(
        `Are you sure you want to delete ${patient.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
         await deletePatient(id);
        
        allPatientsList = allPatientsList.filter((p) => p.id !== id);

        updateUI();
    } catch (error) {
        console.error(`Error deleting patient, Error: ${error.message}`);
    }
};

// ======================
// DATA PROCESSING (SEARCH / FILTER / SORT)
// ======================
const applyFilterAndRender = () => {
    let result = [...allPatientsList];
    const searchValue = patientTableSearchInput.value.toLowerCase();
    const status = statusFilter.value.toLowerCase();
    const gender = genderFilter.value.toLowerCase();

    // Search
    if (searchValue) {
        result = result.filter((p) =>
            p.name.toLowerCase().includes(searchValue),
        );
    }
    // filter by status
    if (status !== "all") {
        result = result.filter((p) => p.status.toLowerCase().includes(status));
    }
    // filter by gender
    if (gender !== "all") {
        result = result.filter((p) => p.gender.toLowerCase().includes(gender));
    }
    displayPatients(result);
};

// ======================
// UI RENDERING
// ======================
const displayPatients = (patients) => {
    tableBody.innerHTML = "";

    patients.reverse().forEach((patient) => {
        const tableRow = document.createElement("tr");
        tableRow.classList.add("patient-record");
        tableRow.setAttribute("role", "row");
        tableRow.innerHTML = `           
        <td role="cell">${patient.name}</td>
        <td class="numeric" role="cell">${calculateAge(patient.dateOfBirth)}</td>
        <td role="cell">${patient.condition}</td>
        <td role="cell">${patient.email}</td>
        <td role="cell">
            <div class="patients-table-action-buttons">
                <!-- view -->
                <div class="actions-icon-wrapper" data-id="${patient.id}" data-action="view" role="button" arial-label="view patient details">
                    <svg class=" patients-table-actions-view-icon | patients-table-actions-icon" >
                        <use xlink:href="../src/assets/images/misc/misc.svg#view"></use>
                    </svg>
                </div>
                <!-- edit -->
                <div class="actions-icon-wrapper" data-id="${patient.id}" data-action="edit" role="button" arial-label="edit patient details">
                    <svg class="patients-table-actions-edit-icon | patients-table-actions-icon">
                        <use xlink:href="../src/assets/images/misc/misc.svg#edit"></use>
                    </svg>
                </div>
                <!-- delete -->
                <div class="actions-icon-wrapper" data-id="${patient.id}" data-action="delete" role="button" arial-label="delete patient data">
                    <svg class="patients-table-actions-delete-icon | patients-table-actions-icon">
                        <use xlink:href="../src/assets/images/misc/misc.svg#delete"></use>
                    </svg>
                </div>
            </div>
        </td>       
    `;
        tableBody.prepend(tableRow);
    });
};

const openViewModal = (patient) =>{
    const{
        name,
        dateOfBirth,
        email,
        phone,
        condition,
        status,
        lastVisit,
        notes
        } = patient;

    let gender = patient.gender
    if(gender ==='man') gender="male"

    const age = calculateAge(dateOfBirth);

    const viewDialog = document.querySelector("#viewModal");

    viewDialog.innerHTML = `<article>
    <!-- HEADER -->
    <header class="view-modal-header">
      <h2 class="modal-title | fw-bold" id="viewModalTitle">Patient Details</h2>
      <button commandfor="viewModal" command="close" class="btn" aria-label="close dialog" data-type="close-modal-btn">&times;</button>
    </header>
    <!-- MAIN CONTENT -->
    <div class="modal-body">
      <!-- Identity -->
      <section class="view-modal-patient-identity">
        <h3 class="modal-title | fw-semi-bold">${name}</h3>
        <p><span class="capitalize">${gender}<span/> • ${age} years</p>
      </section>
      <!-- Details -->
      <div class="patient-details-wrapper">
        <dl class="patient-details">
          <!-- Condition , Date-of-Last-Visit  & Status Group -->
          <div class="patient-details-group">
                        <!-- Condition -->
            <div class="patient-detail-wrapper">
              <dt>Condition:</dt>
              <dd>${condition || "N/A"}</dd>
            </div>
                        <!-- Date-of-Last-Visit -->
            <div class="patient-detail-wrapper">
      <dt>Last Visit:</dt>
      <dd>${formatDate(lastVisit)}</dd>
            </div>

                        <!-- status -->
            <div class="patient-detail-wrapper">
      <dt>Status: </dt>
      <dd class="capitalize">${status || "N/A"}</dd>
            </div>
          </div>
          
          <!-- Phone Email DOB   Group -->
          <div class="patient-details-group">
                      <!-- phone -->
            <div class="patient-detail-wrapper">
              <dt>Phone:</dt>
              <dd>${phone || "N/A"}</dd>
            </div>
                      <!-- email -->
            <div class="patient-detail-wrapper">
              <dt>Email:</dt>
              <dd>${email || "N/A"}</dd>
            </div>
            <!-- DOB -->
            <div class="patient-detail-wrapper">
              <dt>Date of Birth:</dt>
              <dd>${formatDate(dateOfBirth)}</dd>
            </div>
          </div>
        </dl>
        </div>
        <section class="patient-notes">
  <h4>Clinical Notes</h4>
  <p>${notes}</p>
</section>
      </div>    
  </article>`    

    viewDialog.showModal()


}

// ======================
// CONTROLLER
// ======================
// Central UI updater (single pipeline)
const updateUI = () => {
    applyFilterAndRender();
};

// ======================
// EVENT LISTENERS
// ======================
// Search
patientTableSearchInput.addEventListener("input", updateUI);

// Filters
statusFilter.addEventListener("change", updateUI);
genderFilter.addEventListener("change", updateUI);

//  Form Submit (patient)
addPatientForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPatientData = {
        name: e.target.name.value,
        gender: e.target.gender.value,
        dateOfBirth: e.target.dateOfBirth.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        condition: e.target.condition.value,
        status: e.target.status.value,
        lastVisit: e.target.lastVisit.value,
        notes: e.target.notes.value,
    };
    postPatient(newPatientData);
});

tableBody.addEventListener("click", (e) => {
    const wrapper = e.target.closest(".actions-icon-wrapper");
    

    if (!wrapper) return;

    const id = wrapper.dataset.id;
    const action = wrapper.dataset.action;

    if (action === "view") handleView(id);
    if (action === "edit") handleEdit(id);
    if (action === "delete") handleDelete(id);
});

// ======================
// INIT
// ======================

const init = () => {
    fetchPatients();
};

init();
