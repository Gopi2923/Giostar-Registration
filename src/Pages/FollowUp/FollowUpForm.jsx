import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const FollowUpForm = ({ patient, selectedDoctor, showFeeField, onSubmit, formatDate }) => {
    const [fee, setFee] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            reason,
            fees: showFeeField ? fee : 'No Fee',
            doctorName: selectedDoctor.doctorName, // Directly use the doctor's name
            doctorRef: selectedDoctor.doctorRef, // Include the doctor's ID for submission
        };
        onSubmit(data);
    };

    const handleInputChange = (e) => {
        const {value} = e.target 
        if(/^\d*$/.test(value)) {
            setFee(value);
        }
    }
    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <header className="header">
            <i className="fas fa-hospital-alt"></i>
                <h1>Follow-Up Form</h1>
            </header>

            <div className="form-group">
                <label htmlFor="patientName">Patient Name</label>
                <input
                    id="patientName"
                    type="text"
                    value={patient.firstName}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="doctor">Doctor Name</label>
                <input
                    id="doctor"
                    type="text"
                    value={selectedDoctor.doctorName} // Directly display the selected doctor's name
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="dateOfConsultation">Date of Consultation</label>
                <input type="text" id="dateOfConsultation" value={formatDate(new Date())} disabled />
            </div>

            <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <input
                    id="reason"
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>

            {showFeeField && (
                <div className="form-group">
                    <label htmlFor="fee">Fee<span className="required">*</span></label>
                    <input
                        id="fee"
                        type="text"
                        value={fee}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            )}

            <button type="submit" className="submit-button">
                Submit <FontAwesomeIcon icon={faCircleCheck} />
            </button>
        </form>
    );
};

export default FollowUpForm;
