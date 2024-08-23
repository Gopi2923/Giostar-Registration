import React, { useState, useEffect } from 'react';

const ConsultationForm = ({ patient, doctors, onSubmit, formatDate}) => {
    const [fee, setFee] = useState('');
    const [reason, setReason] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');

    useEffect(() => {
        if (doctors.length > 0) {
            setSelectedDoctor(doctors[0]._id);  // Auto-select the first doctor if available
        }
    }, [doctors]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const selectedDoctorInfo = doctors.find(doc => doc._id === selectedDoctor);
        const data = {
            reason,
            fees: fee,
            doctorName: selectedDoctorInfo ? selectedDoctorInfo.doctorName : '',
        };
        onSubmit(data);
    };

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <header className="header">
            <i className="fas fa-hospital-alt"></i>
                <h1>Consultation Form</h1>
            </header>

            <div className="form-group">
                <label htmlFor="patientName">Patient</label>
                <input
                    id="patientName"
                    type="text"
                    value={patient.firstName}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="doctor">Doctor <span className="required">*</span></label>
                <select
                    id="doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                    {doctors.map(doc => (
                        <option key={doc._id} value={doc._id}>{doc.firstName}</option>
                    ))}
                </select>
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

            <div className="form-group">
                <label htmlFor="fee">Fee <span className="required">*</span></label>
                <input
                    id="fee"
                    type="text"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="submit-button">
                Submit
            </button>
        </form>
    );
};

export default ConsultationForm;
