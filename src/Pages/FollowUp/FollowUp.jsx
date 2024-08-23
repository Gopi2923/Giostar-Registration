import React, { useState } from 'react';
import './FollowUp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import qrimg from '../../assets/images/qrcode.png';
import PatientSearchForm from './PatientSearchForm';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import ConsultationForm from './ConsultationForm';
import DoctorList from './DoctorList.js.jsx';
import ConsultationDetails from './ConsultationDetails';
import Modal from './Modal.jsx';

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
  const [consultationResponse, setConsultationResponse] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [previousPage, setPreviousPage] = useState('');
  const [doctorList, setDoctorList] = useState([]);
  const [doctorListVisible, setDoctorListVisible] = useState(false);

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
      toast.error('Number not found.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    setIsVerified(null);
    setDoctorListVisible(false);
    setShowConsultationForm(false);
  };

  const handleContinue = () => {
    setShowModal(true);
    setModalContent('Please select consultation type.');
  };

  const handleConsultationTypeSelection = async (type) => {
    setPreviousPage('details');
    setConsultationType(type);
    setShowModal(false);
    setIsVerifying(true);
  
    if(type === 'Follow-Up') {
      try {
        const response = await axios.post('https://giostar.onrender.com/consultation/doctorsList', {
          patientRef: selectedPatient._id,
        });
        setDoctorList(response.data);
        setDoctorListVisible(true);
        setShowConsultationForm(false); // Ensure the consultation form is hidden
        setSelectedPatient(null); // Clear the selected patient to move away from the patient details page
      } catch (error) {
        console.error('Error fetching doctor list:', error);
      } finally {
        setIsVerifying(false);
      }
    }
  };
  

  const handleDoctorSelection = async (doctor) => {
    setConsultationData({ ...consultationData, doctorName: `${doctor.doctorName}` });

    try {
      const response = await axios.get(`https://giostar.onrender.com/consultation/checkFollowUp/${selectedPatient._id}/${doctor._id}`);
      const isFollowUp = response.data.data;

      if (isFollowUp) {
        setConsultationData({ ...consultationData, fees: 'No fee' });
      } else {
        setConsultationData({ ...consultationData, fees: '' });
      }

      setIsVerified(isFollowUp);
      setShowConsultationForm(true);
      setDoctorListVisible(false);
    } catch (error) {
      console.error('Error checking follow-up status:', error);
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
        setConsultationResponse(response.data);
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
    setIsProcessingPayment(true);
    await submitConsultation();
    setPaymentPending(false);
    setIsProcessingPayment(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='registration-container'>
      <button className="back-btn" onClick={() => navigate('/')}>
        <FontAwesomeIcon icon={faCircleLeft} beat style={{ color: "#FFD43B" }} /> Back to Home
      </button>
      {consultationResponse ? (
        <ConsultationDetails consultationResponse={consultationResponse} formatDate={formatDate} />
      ) : selectedPatient ? (
        <PatientDetails
          selectedPatient={selectedPatient}
          handleContinue={handleContinue}
          formatDate={formatDate}
          setSelectedPatient={setSelectedPatient}
        />
      ) : doctorListVisible ? (
        <DoctorList doctorList={doctorList} handleDoctorSelection={handleDoctorSelection} />
      ) : showConsultationForm ? (
        <ConsultationForm
          selectedPatient={selectedPatient}
          consultationData={consultationData}
          handleChange={handleChange}
          handleConsultationSubmit={handleConsultationSubmit}
          doctorList={doctorList}
          consultationType={consultationType}
          isVerified={isVerified}
          showConsultationForm={showConsultationForm}
          previousPage={previousPage}
        />
      ) : patients.length === 0 ? (
        <PatientSearchForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSearching={isSearching}
        />
      ) : (
        <PatientList patients={patients} handlePatientClick={handlePatientClick} />
      )}
      <Modal 
        showModal={showModal} 
        closeModal={closeModal} 
        modalContent={modalContent} 
        paymentPending={paymentPending} 
        confirmPayment={confirmPayment} 
        isProcessingPayment={isProcessingPayment} 
        handleConsultationTypeSelection={handleConsultationTypeSelection} 
        consultationType={consultationType}
      />
      <ToastContainer />
    </div>
  );
};

export default FollowUp;
