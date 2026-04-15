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
// APPLICATION STATE
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

/* 
User clicks delete
   ↓
Call API (DELETE)
   ↓
Update local state (patients)
   ↓
Re-run filters/search
   ↓
Re-render UI
*/

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
    console.log("chillllll!!!!");
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
    <tr>        
        <td role="cell">${patient.name}</td>
        <td class="numeric" role="cell">${calculateAge(patient.dateOfBirth)}</td>
        <td role="cell">${patient.condition}</td>
        <td role="cell">${patient.email}</td>
        <td role="cell">
            <div class="patients-table-action-buttons">
                <!-- view -->
                <div class="actions-icon-wrapper" data-id="${patient.id}" data-action="view">
                    <svg class=" patients-table-actions-view-icon | patients-table-actions-icon" >
                        <use xlink:href="../src/assets/images/misc/misc.svg#view"></use>
                    </svg>
                </div>
                <!-- edit -->
                <div class="actions-icon-wrapper" data-id="${patient.id}" data-action="edit">
                    <svg class="patients-table-actions-edit-icon | patients-table-actions-icon">
                        <use xlink:href="../src/assets/images/misc/misc.svg#edit"></use>
                    </svg>
                </div>
                <!-- delete -->
                <div class="actions-icon-wrapper" data-id="${patient.id}" data-action="delete">
                    <svg class="patients-table-actions-delete-icon | patients-table-actions-icon">
                        <use xlink:href="../src/assets/images/misc/misc.svg#delete"></use>
                    </svg>
                </div>
            </div>
        </td>
    </tr>    
    `;
        tableBody.prepend(tableRow);
    });
};

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
