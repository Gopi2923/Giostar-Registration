import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleCheck, faCircleLeft, faAnglesLeft, faAnglesRight, faPersonWalkingArrowLoopLeft, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';

const PatientDetails = ({ selectedPatient, handleContinue, formatDate, setSelectedPatient }) => (
  <div className="patients-details">
    <h1>Patient Details</h1>
    <div className="patient-details-list">
      <p><strong>Name:</strong> {`${selectedPatient.firstName} ${selectedPatient.lastname}`}</p>
      <p><strong>Mobile Number:</strong> {selectedPatient.mobile_number}</p>
      <p><strong>Email:</strong> {selectedPatient.email}</p>
      <p><strong>Age:</strong> {selectedPatient.age}</p>
      <p><strong>Gender:</strong> {selectedPatient.gender}</p>
      <p><strong>Date of Registration:</strong> {formatDate(selectedPatient.dateOfRegistration)}</p>
    </div>
    <div className="button-container">
      <button onClick={() => setSelectedPatient(null)} className='back-button'>
        <FontAwesomeIcon icon={faAnglesLeft} fade size='xl' /> Back to List
      </button>
      <button onClick={handleContinue} className='continue-button'>
        Continue <FontAwesomeIcon icon={faAnglesRight} fade size='xl' />
      </button>
    </div>
  </div>
);

export default PatientDetails;
