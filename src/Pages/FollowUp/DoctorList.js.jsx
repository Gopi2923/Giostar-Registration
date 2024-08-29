import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DoctorList = ({ doctors, selectDoctor }) => { 
    if (!doctors || doctors.length === 0) {
        return (
            <div className="fallback-message">
                <FontAwesomeIcon icon={faExclamationTriangle} size="5x" style={{ color: "#FF6347", marginRight: "10px" }} />
                <h1>Please Consult Doctor Before Followup</h1>
            </div>
        );
    }

    return (
        <div className="patient-list">
            <h1>Select Doctor</h1>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor._id} onClick={() => selectDoctor(doctor)}>
                        <div className="doctor-name">Doctor Name: Dr. {doctor.doctorName}</div>
                        <FontAwesomeIcon icon={faArrowRight} beat size="2xl" style={{ color: "#B197FC" }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorList;
