import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const DoctorList = ({ doctorList, handleDoctorSelection }) => (
  <div className="patient-list">
    <h1>Doctor List</h1>
    <ul>
      {doctorList.data?.map(doctor => (
        <li key={doctor._id} onClick={() => handleDoctorSelection(doctor)}>
          <div className="doctor-name">Doctor Name: {`${doctor.doctorName}`}</div>
          <FontAwesomeIcon icon={faArrowRight} beat size="2xl" style={{ color: "#B197FC" }} />
        </li>
      ))}
    </ul>
  </div>
);

export default DoctorList;
