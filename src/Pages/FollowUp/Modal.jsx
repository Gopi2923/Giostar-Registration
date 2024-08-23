import React from 'react';
import Modal from 'react-modal';

const FollowUpConsultationModal = ({ isOpen, onClose, onSelect }) => {
    return (
        
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
            <h2>Select an Option</h2>
            <div className="button-containers">
            <button onClick={() => onSelect('follow-up')} className='modal-content-btn'>Follow-Up</button>
            <button onClick={() => onSelect('consultation')} className='modal-content-btn'>Consultation</button>
            </div>
            </div>
        </div>
        </Modal>
        
    );
};

export default FollowUpConsultationModal;
