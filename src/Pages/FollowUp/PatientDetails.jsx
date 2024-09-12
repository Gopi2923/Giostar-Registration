import React from 'react';

const PatientDetails = ({ patient, onBack, onContinue, formatDate }) => {
    return (
        <div className="patients-details">
    <h1>Patient Details</h1>
    <div className="patient-details-list">
            <p>Name: {patient.patientName}</p>
            <p>Mobile: {patient.mobile_number}</p>
            <p>Email: {patient.email}</p>
            <p>Age: {patient.age}</p>
            <p>Gender: {patient.gender}</p>
            <p>Date of Registration: {formatDate(patient.dateOfRegistration)}</p>
            </div>
            <div className="button-container">
            {/* Display more details as needed */}
            <button onClick={onBack} className='back-button'>Back to Patient List</button>
            <button onClick={onContinue} className='continue-button'>Continue</button>
            </div>
        </div>
    );
};

export default PatientDetails;
