// ConsultationTypeModal.js
import React from 'react';

const ConsultationTypeModal = ({ closeModal, selectConsultationType }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h3>Select Consultation Type</h3>
        <div className="button-container">
          <button onClick={() => selectConsultationType('Follow-Up')} className='modal-content-btn'>Follow-Up</button>
          <button onClick={() => selectConsultationType('Consultation')} className='modal-content-btn'>Consultation</button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationTypeModal;
