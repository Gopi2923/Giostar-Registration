import React, { useState } from 'react';
import './FollowUp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import qrimg from '../../assets/images/qrcode.png';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile_number') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length <= 10) {
        setFormData({ ...formData, [name]: cleanedValue });
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
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientClick = async (patient) => {
    setIsVerifying(true);
    try {
      const response = await axios.get(`https://giostar.onrender.com/registration/getRegistration/${patient._id}`);
      if (response.data.success) {
        setSelectedPatient(patient);
        setIsVerified(response.data.data);
      } else {
        alert('Patient registration verification failed.');
      }
    } catch (error) {
      console.error('Error verifying patient registration:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    setShowConsultationForm(true);
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
      type: consultationData.fees === "No fee" || consultationData.fees.trim() === "" ? "Follow-Up" : "Consultation",
      doctorName: consultationData.doctorName,
      dateOfConsultation: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await axios.post('https://giostar.onrender.com/consultation/add', payload);
      if (response.data._id) {
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
    await submitConsultation();
    setPaymentPending(false);
  };

  const closeModal = () => {
    setShowModal(false);
    if (!paymentPending) {
      navigate('/');
    }
  };

  return (
    <div className='registration-container'>
      <button className="back-btn" onClick={() => navigate('/')}>Back to Home</button>
      {selectedPatient ? (
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
                <label htmlFor="doctorName">Doctor Name</label>
                <input type="text" id="doctorName" name="doctorName" value={consultationData.doctorName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea id="reason" name="reason" value={consultationData.reason} onChange={handleChange} required></textarea>
              </div>
              {isVerified === false && (
                <div className="form-group">
                  <label htmlFor="fees">Fees</label>
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
              <p><strong>Date of Registration:</strong> {new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="button-container">
              <button onClick={() => setSelectedPatient(null)} className='back-button'>Back to List</button>
              <button onClick={handleContinue} className='continue-button'>Continue</button>
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
              <button type="submit" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Submit'}
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
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalContent}</p>
            {paymentPending && consultationData.fees.trim() !== "No fee" && consultationData.fees.trim() !== "" && (
              <div>
                <img src={qrimg} width={350} alt="QR Code for Payment" />
                <button onClick={confirmPayment}>Confirm Payment</button>
              </div>
            )}
            {!paymentPending && <button onClick={closeModal}>Close</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUp;
