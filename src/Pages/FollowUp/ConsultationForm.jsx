import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const ConsultationForm = ({ patient, doctors, onSubmit, formatDate }) => {
    const [fee, setFee] = useState('');
    const [reason, setReason] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');

    useEffect(() => {
        if (selectedDoctor) {
            const selectedDoctorInfo = doctors.find(doc => doc.doctorId === selectedDoctor);
            if (selectedDoctorInfo && selectedDoctorInfo.availableSlots.length > 0) {
                setAvailableSlots(selectedDoctorInfo.availableSlots);
            } else {
                setAvailableSlots([]);
            }
        } else {
            setAvailableSlots([]);
        }
    }, [selectedDoctor, doctors]);

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const selectedDoctorInfo = doctors.find(doc => doc.doctorId === selectedDoctor);
    
        if (!selectedDoctorInfo || !selectedDoctorInfo.availableSlots || selectedDoctorInfo.availableSlots.length === 0) {
            alert('No available slots for the selected doctor.');
            return;
        }
    
        const selectedSlotInfo = selectedDoctorInfo.availableSlots.find(slot => 
            `${slot.startTime} - ${slot.endTime}` === selectedSlot
        );
    
        if (!selectedSlotInfo) {
            alert('Please select a valid time slot.');
            return;
        }
    
        const doctorName = `${selectedDoctorInfo.firstName} ${selectedDoctorInfo.lastName}`;

        const data = {
            reason,
            fees: fee,
            doctorRef: selectedDoctor,
            doctorName,
            day: selectedSlotInfo.day, // Assuming 'day' is part of the availableSlots
            startTime: selectedSlotInfo.startTime,
            endTime: selectedSlotInfo.endTime,
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
                <h1>Consultation Form</h1>
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
                <label htmlFor="doctor">Doctor Name<span className="required">*</span></label>
                <select
                    id="doctor"
                    value={selectedDoctor}
                    required
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                    <option value="">Select a doctor</option>
                    {doctors.map(doc => (
                        <option key={doc.doctorId} value={doc.doctorId}>{doc.firstName} {doc.lastName}</option>
                    ))}
                </select>
            </div>

            {availableSlots.length > 0 && (
                <div className="form-group">
                    <label htmlFor="slot">Select Time Slot<span className="required">*</span></label>
                    <select
                        id="slot"
                        value={selectedSlot}
                        required
                        onChange={(e) => setSelectedSlot(e.target.value)}
                    >
                        <option value="">Select a time slot</option>
                        {availableSlots.map((slot, index) => (
                            <option key={index} value={`${slot.startTime} - ${slot.endTime}`}>
                                {`${slot.startTime} - ${slot.endTime}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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

            <button type="submit" className="submit-button">
                Submit <FontAwesomeIcon icon={faCircleCheck} />
            </button>
        </form>
    );
};

export default ConsultationForm;
