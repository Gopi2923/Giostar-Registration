// DoctorList.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const DoctorList = ({ doctors, selectDoctor }) => {
    if (!doctors || doctors.length === 0) {
        return <h1>No doctors available</h1>;  // Fallback if no doctors are found
    }

    return (
        <div className="patient-list">
    <h1>Select Doctor </h1>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor._id} onClick={() => selectDoctor(doctor)}>
                         <div className="doctor-name">Doctor Name: Dr. {doctor.doctorName} </div>
                        <FontAwesomeIcon icon={faArrowRight} beat size="2xl" style={{ color: "#B197FC" }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorList;
