import React from 'react';

const ConsultationDetails = ({ consultationResponse, formatDate, selectedPatient }) => (
  
  <div className="booking-details">
    <h1>Consultation Details</h1>
    <div className="booking-details-list">
      <p><strong>Thank you for booking!</strong></p>
      {consultationResponse.patientId && <p><strong>Patient ID:</strong> {consultationResponse.patientId}</p>}
      <p><strong>Patient Name:</strong> {`${selectedPatient.patientName}`}</p>
      {consultationResponse.doctorName && <p><strong>Doctor Name: Dr.</strong> {consultationResponse.doctorName}</p>}
       <p><strong>Time:</strong> {`${consultationResponse.startTime} - ${consultationResponse.endTime}`}</p>
      {consultationResponse.reason && <p><strong>Reason:</strong> {consultationResponse.reason}</p>}
      {consultationResponse.fees && <p><strong>Fees:</strong> {consultationResponse.fees}</p>}
      {consultationResponse.dateOfConsultation && <p><strong>Date of Consultation:</strong> {formatDate(consultationResponse.dateOfConsultation)}</p>}
    </div>
  </div>
);

export default ConsultationDetails;
