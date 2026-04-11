const addPatientForm = document.querySelector("#addPatientForm");
const tableBody = document.querySelector("#patientsTableBody");
const BASE_URL = "http://localhost:3000/patients";

const allPatientsList  = [];


// Patients Age
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


// Patients Display
const displayPatients = (patients) => {

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
// Fetch patients
const fetchPatients = async () => {
    try{
        const response = await fetch(BASE_URL);
        if(!response.ok){
            throw new Error("Failed to fetch patients");
        }
        const patients = await response.json();
        displayPatients(patients);
        allPatientsList.push(...patients);        

    }catch(error){
        console.error("Error fetching patients:", error.message);
    }
}

fetchPatients();
// Post Patient
const postPatient = async (newPatientData) => {
    try{
        const response = await fetch(BASE_URL,{
            method:"POST",
            header:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newPatientData)
        });
        if(!response.ok) throw new Error("Failed to create patient");
    const newPatient = await response.json()
    displayPatients([newPatient])
    allPatientsList.unshift([newPatient])

    }catch(error){
        console.error("Error:", error.message);
    }
}
// Add Patient
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