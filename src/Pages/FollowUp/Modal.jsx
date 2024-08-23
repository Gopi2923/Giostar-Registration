import React from 'react';
import { TailSpin } from 'react-loader-spinner';
import qrimg from '../../assets/images/qrcode.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleCheck, faCircleLeft, faAnglesLeft, faAnglesRight, faPersonWalkingArrowLoopLeft, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ 
  showModal, 
  closeModal, 
  modalContent, 
  paymentPending, 
  confirmPayment, 
  isProcessingPayment, 
  handleConsultationTypeSelection, 
  consultationType, 
}) => (
  showModal ? (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <p>{modalContent}</p>
        {paymentPending && (
          <div>
            <img src={qrimg} width={350} alt="QR Code for Payment" />
            <p>Payment Amount: {consultationData.fees}</p>
            <button onClick={confirmPayment} type='submit' className='search-spinner' disabled={isProcessingPayment}>
              {isProcessingPayment ? (
                <> <span>Please Wait</span> <TailSpin color="#fff" height={34} width={44} /> </>
              ) : (
                'Confirm Payment'
              )}
            </button>
          </div>
        )}
        {!paymentPending && consultationType === "" && (
          <div className="button-containers">
            <button onClick={() => handleConsultationTypeSelection('Follow-Up')} className='modal-content-btn'>
              <FontAwesomeIcon icon={faPersonWalkingArrowLoopLeft} beat style={{ color: "#FFD43B" }} size='xl' /> Follow-Up
            </button>
            <button onClick={() => handleConsultationTypeSelection('Consultation')} className='modal-content-btn'>
              <FontAwesomeIcon icon={faPersonCirclePlus} beat size="xl" style={{ color: "#FFD43B" }} /> Consultation
            </button>
          </div>
        )}
        {!paymentPending && consultationType !== "" && (
          <div className="success-icon">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
        )}
      </div>
    </div>
  ) : null
);

export default Modal;
