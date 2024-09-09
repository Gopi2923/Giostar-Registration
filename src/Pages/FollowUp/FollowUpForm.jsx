import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const FollowUpForm = ({ patient, selectedDoctor, showFeeField, onSubmit, formatDate, availableTimeslots }) => {
    const [fee, setFee] = useState('');
    const [reason, setReason] = useState('');
    const [selectedTimeslot, setSelectedTimeslot] = useState(null); // State for selected timeslot object

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            reason,
            fees: showFeeField ? fee : 'No Fee',
            doctorName: selectedDoctor.doctorName,
            doctorRef: selectedDoctor.doctorRef,
            day: selectedTimeslot?.day, // Include the selected timeslot day
            startTime: selectedTimeslot?.startTime,
            endTime: selectedTimeslot?.endTime,
        };
        onSubmit(data);
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            setFee(value);
        }
    };

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
                    value={`${patient.firstName} ${patient.lastname}`}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="doctor">Doctor Name</label>
                <input
                    id="doctor"
                    type="text"
                    value={selectedDoctor.doctorName}
                    readOnly
                />
            </div>
            
            {availableTimeslots.length > 0 && (
                <div className="form-group">
                    <label htmlFor="timeslot">Select Time Slot<span className="required">*</span></label>
                    <select
                        id="timeslot"
                        value={selectedTimeslot ? `${selectedTimeslot.startTime} - ${selectedTimeslot.endTime}` : ''}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedSlot = availableTimeslots.find(slot => 
                                `${slot.startTime} - ${slot.endTime}` === selectedValue
                            );
                            setSelectedTimeslot(selectedSlot); // Set the entire timeslot object
                        }}
                        required
                    >
                        <option value="" disabled>Select a time slot</option>
                        {availableTimeslots.map((slot, index) => (
                            <option key={index} value={`${slot.startTime} - ${slot.endTime}`}>
                                {`${slot.startTime} - ${slot.endTime}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className='form-group'>
                <label htmlFor='lastConsultedDate'>Last Consulted Date</label>
                <input
                    type="text"
                    id='lastConsultedDate'
                    readOnly
                    value={formatDate(selectedDoctor.lastConsultedDate)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="dateOfConsultation">Date of Consultation</label>
                <input
                    type="text"
                    id="dateOfConsultation"
                    value={formatDate(new Date())}
                    disabled
                />
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
