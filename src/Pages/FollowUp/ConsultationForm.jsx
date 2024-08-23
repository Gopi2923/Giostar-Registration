import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleCheck, faCircleLeft, faAnglesLeft, faAnglesRight, faPersonWalkingArrowLoopLeft, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';

const ConsultationForm = ({ 
  selectedPatient, 
  consultationData, 
  handleChange, 
  handleConsultationSubmit, 
  doctorList, 
  consultationType, 
  isVerified, 
  showConsultationForm, 
  previousPage 
}) => (
  showConsultationForm ? (
    <div className="registration-form">
      <button onClick={() => {
        setShowConsultationForm(false);
        setConsultationType("");
        if (previousPage === 'details') {
          setSelectedPatient(selectedPatient);
        } else {
          setShowModal(true);
        }
      }} className="back-btn">
        <FontAwesomeIcon icon={faAnglesLeft} fade size='xl' /> Back
      </button>
      <div className="header">
        <i className="fas fa-hospital-alt"></i>
        <h1>Consultation Form</h1>
      </div>
      <form onSubmit={handleConsultationSubmit}>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name</label>
          <input type="text" id="patientName" value={`${selectedPatient.firstName} ${selectedPatient.lastname}`} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfConsultation">Date of Consultation</label>
          <input type="text" id="dateOfConsultation" value={formatDate(new Date())} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="doctorName">Doctor Name <span className="required">*</span></label>
          <select
            id="doctorName"
            name="doctorName"
            value={consultationData.doctorName}
            onChange={handleChange}
            disabled={(consultationType === 'Follow-Up' && isVerified) || (consultationType === 'Follow-Up' && !isVerified)}
            required
          >
            <option value="">Select Doctor</option>
            {doctorList.data && doctorList.data.map((doctor, index) => (
              <option key={index} value={`${doctor.doctorName}`}>
                {doctor.doctorName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea id="reason" name="reason" value={consultationData.reason} onChange={handleChange}></textarea>
        </div>
        {(consultationType !== 'Follow-Up' || !isVerified) && (
          <div className="form-group">
            <label htmlFor="fees">Fees <span className="required">*</span></label>
            <input type="text" id="fees" name="fees" value={consultationData.fees} onChange={handleChange} required />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  ) : null
);

export default ConsultationForm;
