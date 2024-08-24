import React from 'react';

const FollowUpConsultationModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Select an Option</h2>
                <div className="button-containers">
                    <button onClick={() => onSelect('follow-up')} className='modal-content-btn'>Follow-Up</button>
                    <button onClick={() => onSelect('consultation')} className='modal-content-btn'>Consultation</button>
                </div>
            </div>
        </div>
    );
};

export default FollowUpConsultationModal;
