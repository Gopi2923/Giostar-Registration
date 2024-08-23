import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const PatientList = ({ patients, handlePatientClick }) => (
  <div className="patient-list">
    <h1>Patient List</h1>
    <ul>
      {patients.data.map(patient => (
        <li key={patient._id} onClick={() => handlePatientClick(patient)}>
          <div className="patient-name">Patient Name: {`${patient.firstName} ${patient.lastname}`}</div>
          <FontAwesomeIcon icon={faArrowRight} beat size="2xl" style={{ color: "#B197FC" }} />
        </li>
      ))}
    </ul>
  </div>
);

export default PatientList;
