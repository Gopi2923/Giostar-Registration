import React, { useState } from 'react';
import './FollowUp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleCheck, faCircleLeft, faAnglesLeft, faAnglesRight, faPersonWalkingArrowLoopLeft, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import qrimg from '../../assets/images/qrcode.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FollowUp = () => {
  const [formData, setFormData] = useState({ mobile_number: "" });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [consultationData, setConsultationData] = useState({ doctorName: "", reason: "", fees: "" });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [paymentPending, setPaymentPending] = useState(false);
  const [consultationType, setConsultationType] = useState("");
  const [consultationResponse, setConsultationResponse] = useState(null); // Add state for consultation response
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile_number') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length <= 10) {
        setFormData({ ...formData, [name]: cleanedValue });
      }
    } else if (name === 'doctorName') {
      const alphaRegex = /^[A-Za-z\s]+$/;
      if (alphaRegex.test(value) || value === '') {
        setConsultationData({ ...consultationData, [name]: value });
      }
    } else if (name === 'fees') {
      const numericRegex = /^\d*$/;
      if (numericRegex.test(value)) {
        setConsultationData({ ...consultationData, [name]: value });
      }
    } else {
      setConsultationData({ ...consultationData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const response = await axios.post('https://giostar.onrender.com/registration/getByMobileNumber', formData);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Number not found.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    setIsVerified(null);
  };

  const handleContinue = () => {
    setShowModal(true);
    setModalContent('Please select consultation type.');
  };

  const handleConsultationTypeSelection = async (type) => {
    setConsultationType(type);
    setShowModal(false);
    setIsVerifying(true);

    try {
      const response = await axios.get(`https://giostar.onrender.com/registration/getRegistration/${selectedPatient._id}`);
      const isFollowUp = response.data.data;

      if (isFollowUp) {
        if (type === 'Follow-Up') {
          setConsultationData({ ...consultationData, doctorName: selectedPatient.doctorName, fees: 'No fee' });
        } else {
          setConsultationData({ ...consultationData, doctorName: '', fees: '' });
        }
      } else {
        if (type === 'Follow-Up') {
          setConsultationData({ ...consultationData, doctorName: selectedPatient.doctorName, fees: '' });
        } else {
          setConsultationData({ ...consultationData, doctorName: '', fees: '' });
        }
      }

      setIsVerified(isFollowUp);
    } catch (error) {
      console.error('Error checking follow-up status:', error);
    } finally {
      setIsVerifying(false);
      setShowConsultationForm(true);
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (consultationData.fees === "No fee" || consultationData.fees.trim() === "") {
      await submitConsultation();
    } else {
      setPaymentPending(true);
      setModalContent('Please complete the payment.');
      setShowModal(true);
    }
  };

  const submitConsultation = async () => {
    const payload = {
      patientId: selectedPatient.patientId,
      patientRef: selectedPatient._id,
      reason: consultationData.reason,
      fees: consultationData.fees,
      status: consultationData.fees === "No fee" || consultationData.fees.trim() === "" ? "Paid" : "Yet to pay",
      type: consultationType,
      doctorName: consultationData.doctorName,
      dateOfConsultation: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await axios.post('https://giostar.onrender.com/consultation/add', payload);
      if (response.data._id) {
        setConsultationResponse(response.data); // Store the response data
        setModalContent('Consultation booking done.');
        setShowModal(true);
        setShowConsultationForm(false);
      } else {
        alert('Error adding consultation');
      }
    } catch (error) {
      console.error('Error adding consultation:', error);
      alert('Error adding consultation');
    }
  };

  const confirmPayment = async () => {
    setIsProcessingPayment(true)
    await submitConsultation();
    setPaymentPending(false)
    setIsProcessingPayment(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className='registration-container'>
      <button className="back-btn" onClick={() => navigate('/')}><FontAwesomeIcon icon={faCircleLeft} beat style={{color: "#FFD43B",}} /> Back to Home</button>
      {consultationResponse ? (
        <div className="booking-details">
          <h1>Consultation Details</h1>
          <div className="booking-details-list">
          <p><strong>Thank you for booking!</strong></p>
          {consultationResponse.patientId && <p><strong>Patient ID:</strong> {consultationResponse.patientId}</p>}
          <p><strong>Patient Name:</strong> {`${selectedPatient.firstName} ${selectedPatient.lastname}`}</p>
          {consultationResponse.doctorName && <p><strong>Doctor Name:</strong> {consultationResponse.doctorName}</p>}
          {consultationResponse.reason && <p><strong>Reason:</strong> {consultationResponse.reason}</p>}
          {consultationResponse.fees &&  <p><strong>Fees:</strong> {consultationResponse.fees}</p>}
          {consultationResponse.dateOfConsultation && <p><strong>Date of Consultation:</strong> {new Date(consultationResponse.dateOfConsultation).toLocaleDateString()}</p>}
        </div>
        </div>
      ) : (
        selectedPatient ? (
          showConsultationForm ? (
            <div className="registration-form">
              <h2>Consultation Form</h2>
              <form onSubmit={handleConsultationSubmit}>
                <div className="form-group">
                  <label htmlFor="patientName">Patient Name</label>
                  <input type="text" id="patientName" value={`${selectedPatient.firstName} ${selectedPatient.lastname}`} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfConsultation">Date of Consultation</label>
                  <input type="text" id="dateOfConsultation" value={new Date().toLocaleDateString()} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="doctorName">Doctor Name  <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="doctorName" 
                    name="doctorName" 
                    value={consultationData.doctorName} 
                    onChange={handleChange} 
                    disabled={(consultationType === 'Follow-Up' && isVerified) || (consultationType === 'Follow-Up' && !isVerified)} 
                    required 
                  />
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
          ) : (
            <div className="patients-details">
              <h1>Patient Details</h1>
              <div className="patient-details-list">
                <p><strong>Name:</strong> {`${selectedPatient.firstName} ${selectedPatient.lastname}`}</p>
                <p><strong>Mobile Number:</strong> {selectedPatient.mobile_number}</p>
                <p><strong>Email:</strong> {selectedPatient.email}</p>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                <p><strong>Date of Registration:</strong> {new Date(selectedPatient.dateOfRegistration).toLocaleDateString()}</p>
              </div>
              <div className="button-container">
                <button onClick={() => setSelectedPatient(null)} className='back-button'><FontAwesomeIcon icon={faAnglesLeft} fade size='xl'/>Back to List</button>
                <button onClick={handleContinue} className='continue-button'>Continue <FontAwesomeIcon icon={faAnglesRight} fade size='xl'/></button>
              </div>
            </div>
          )
        ) : (
          patients.length === 0 ? (
            <div className="registration-form">
              <div className="header">
                <i className="fas fa-hospital-alt"></i>
                <h2>Patients Follow up & Consultation</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="phone">Enter Mobile Number <span className="required">*</span></label>
                  <input type="tel" id="phone" name="mobile_number" value={formData.mobile_number} onChange={handleChange} pattern="\d{10}" title="Please enter 10 digits" required />
                </div>
                <button type="submit" disabled={isSearching} className="search-spinner">
                  {isSearching ? <> <span>Searching</span> <TailSpin color="#fff" height={34} width={44}/> </>: 'Submit'}
                </button>
              </form>
            </div>
          ) : (
            <div className="patient-list">
              <h2>Patient List</h2>
              <ul>
                {patients.data.map(patient => (
                  <li key={patient._id} onClick={() => handlePatientClick(patient)}>
                    <div className="patient-name">Patient Name: {`${patient.firstName} ${patient.lastname}`}</div>
                    <FontAwesomeIcon icon={faArrowRight} beat size="2xl" style={{color: "#B197FC",}} />
                  </li>
                ))}
              </ul>
            </div>
          )
        )
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>{modalContent}</p>
            {paymentPending && consultationData.fees.trim() !== "No fee" && consultationData.fees.trim() !== "" && (
              <div>
                <img src={qrimg} width={350} alt="QR Code for Payment" />
                <p>Payment Amount: {consultationData.fees}</p>
                <button onClick={confirmPayment} type='submit' className='search-spinner' disabled={isProcessingPayment}>
                 {isProcessingPayment ? <><span>Please Wait</span><TailSpin  color="#fff" height={34} width={44} /></> : 'Confirm Payment'} </button>
              </div>
            )}
            {!paymentPending && consultationType === "" && (
              <div className="button-containers">
                <button onClick={() => handleConsultationTypeSelection('Follow-Up')} className='modal-content-btn'><FontAwesomeIcon icon={faPersonWalkingArrowLoopLeft} beat style={{color: "#FFD43B",}} size='xl'/>Follow-Up</button>
                <button onClick={() => handleConsultationTypeSelection('Consultation')} className='modal-content-btn'><FontAwesomeIcon icon={faPersonCirclePlus} beat size="xl" style={{color: "#FFD43B",}} />Consultation</button>
              </div>
            )}
            {!paymentPending && consultationType !== "" && (
              <div className="success-icon">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FollowUp;
