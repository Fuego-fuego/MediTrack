// ======================
// DOM ELEMENTS
// ======================
const addPatientForm = document.querySelector("#addPatientForm");
const patientTableSearchInput = document.querySelector('#patientTableSearchInput');
const statusFilter = document.querySelector('#statusFilter');
const genderFilter = document.querySelector('#genderFilter');
const tableBody = document.querySelector("#patientsTableBody");

// ======================
// APPLICATION STATE
// ======================
const allPatientsList  = [];

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

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// ======================
// API CALLS
// ======================
// Fetch all patients
const fetchPatients = async () => {
    try{
        const response = await fetch(BASE_URL);
        if(!response.ok){
            throw new Error("Failed to fetch patients, status:" + response.status);
        }
        const patients = await response.json();
        allPatientsList.push(...patients);
        updateUI();                

    }catch(error){
        console.error("Error fetching patients:", error.message);
    }
}

// Create new patient
const postPatient = async (newPatientData) => {
    try{
        const response = await fetch(BASE_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newPatientData)
        });
        if(!response.ok) throw new Error("Failed to create patient, status:" + response.status);
    const newPatient = await response.json()
    allPatientsList.unshift(newPatient)
    updateUI();

    }catch(error){
        console.error("Error:", error.message);
    }
}

// ======================
// DATA PROCESSING (SEARCH / FILTER / SORT)
// ======================
const applyFilterAndRender = () => {
    let result = [...allPatientsList];    
    const searchValue = patientTableSearchInput.value.toLowerCase();
    const status = statusFilter.value.toLowerCase();
    const gender = genderFilter.value.toLowerCase();
    console.log(genderFilter.value)
    // Search 
    if(searchValue){
        result = result.filter( p => p.name.toLowerCase().includes(searchValue))
    }
    // filter by status 
    if(status !== 'all'){
        result = result.filter(p => p.status.toLowerCase().includes(status))   
        
    }
    // filter by gender
    if(gender !== 'all'){
        result = result.filter(p => p.gender.toLowerCase().includes(gender))   
        
    }
    displayPatients(result);
}

// ======================
// UI RENDERING
// ======================
const displayPatients = (patients) => {
    tableBody.innerHTML = ""; 

    patients.forEach( patient => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("patient-record");
    tableRow.setAttribute("role", "row");    
    tableRow.innerHTML = `
    <tr>
        <td class="visually-hidden hidden" role="cell">${patient.id}</td>
        <td role="cell">${patient.name}</td>
        <td class="numeric" role="cell">${calculateAge(patient.dateOfBirth)}</td>
        <td role="cell">${patient.condition}</td>
        <td role="cell">${patient.email}</td>
        <td role="cell">
            <div class="patients-table-action-buttons">
                <!-- view -->
                <div class="actions-icon-wraper">
                    <svg class=" patients-table-actions-view-icon | patients-table-actions-icon">
                        <use xlink:href="../src/assets/images/misc/misc.svg#view"></use>
                    </svg>
                </div>
                <!-- edit -->
                <div class="actions-icon-wraper">
                    <svg class="patients-table-actions-edit-icon | patients-table-actions-icon">
                        <use xlink:href="../src/assets/images/misc/misc.svg#edit"></use>
                    </svg>
                </div>
                <!-- delete -->
                <div class="actions-icon-wraper">
                    <svg class="patients-table-actions-delete-icon | patients-table-actions-icon">
                        <use xlink:href="../src/assets/images/misc/misc.svg#delete"></use>
                    </svg>
                </div>
            </div>
        </td>
    </tr>    
    `;
    tableBody.prepend(tableRow);
    })    
}

// ======================
// CONTROLLER
// ======================
// Central UI updater (single pipeline)
const updateUI = () =>{
    applyFilterAndRender();
}

// ======================
// EVENT LISTENERS
// ======================
// Search
patientTableSearchInput.addEventListener("input", updateUI);

// Filters
statusFilter.addEventListener('change', updateUI);
genderFilter.addEventListener('change', updateUI)


//  Form Submit (patient)
addPatientForm.addEventListener("submit",  (e) => {
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
            notes: e.target.notes.value  
    }
    postPatient(newPatientData)
    })      

// ======================
// INIT
// ======================

const init = () => {
    fetchPatients();
};

init();

