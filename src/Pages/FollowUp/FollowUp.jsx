import React, { useState, useEffect } from 'react';
import './FollowUp.css';
import PatientSearchForm from './PatientSearchForm';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import Modal from './Modal';
import FollowUpForm from './FollowUpForm';
import ConsultationForm from './ConsultationForm';
import DoctorList from './DoctorList.js'; 
import QRCodeCard from './QRCodeCard.jsx';
import ConsultationDetails from './ConsultationDetails.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';


function FollowUp() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState('');
    const [showFeeField, setShowFeeField] = useState(false);
    const [consultationType, setConsultationType] = useState('');
    const [showDoctorList, setShowDoctorList] = useState(false); 
    const [searchCompleted, setSearchCompleted] = useState(false); 
    const [showPatientDetails, setShowPatientDetails] = useState(true); 
    const [formSubmitted, setFormSubmitted] = useState(false);  
    const [consultationFee, setConsultationFee] = useState(''); 
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); 
    const [consultationResponse, setConsultationResponse] = useState(null); // New state for consultation details

    const navigate = useNavigate();

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
    };

    const handleContinue = () => {
        setModalOpen(true);
    };

    const handleOptionSelect = (option) => {
        setModalOpen(false);
        setConsultationType(option);
        fetchDoctors(option);
        setShowPatientDetails(false);
    };

    const fetchDoctors = (type) => {
        const endpoint = type === 'follow-up'
            ? 'https://giostar.onrender.com/consultation/doctorsList'
            : 'https://giostar.onrender.com/doctor-info/getAll';

        axios.post(endpoint, { patientRef: selectedPatient._id })
            .then(response => {
                setDoctors(response.data.data);
                setSelectedDoctor('');
                setShowFeeField(type === 'follow-up' ? false : true);
                if (type === 'follow-up') {
                    setShowDoctorList(true); 
                }
            })
            .catch(error => {
                console.error('Error fetching doctor list:', error);
            });
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor._id);
        setShowDoctorList(false); 
    };

    useEffect(() => {
        if (consultationType === 'follow-up' && selectedPatient && selectedDoctor) {
            axios.get(`https://giostar.onrender.com/consultation/checkFollowUp/${selectedPatient._id}/${selectedDoctor}`)
                .then(response => {
                    setShowFeeField(!response.data.data); 
                })
                .catch(error => {
                    console.error('Error checking follow-up:', error);
                });
        }
    }, [consultationType, selectedPatient, selectedDoctor]);

    const handleFormSubmit = (formData) => {
        setConsultationFee(formData.fees); 
        setQrCodeImage('./../../assets/images/QR code img.jpeg'); 
        setShowQRCode(true);
        setFormSubmitted(true);
    };

    const confirmPayment = () => {
        setIsProcessingPayment(true);
        const payload = {
            patientId: selectedPatient.patientId,
            patientRef: selectedPatient._id,
            reason: '', // This should be filled with the actual reason from the form
            fees: consultationFee,
            status: consultationFee === "No fee" || consultationFee.trim() === "" ? "Paid" : "Yet to pay",
            type: consultationType,
            doctorName: '', // This should be filled with the actual doctor name from the form
            dateOfConsultation: new Date().toISOString().split('T')[0],
        };

        axios.post('https://giostar.onrender.com/consultation/add', payload)
            .then(response => {
                setIsProcessingPayment(false);
                setConsultationResponse(response.data); // Save the response data to show in the UI
                setShowQRCode(false); // Hide the QR code after payment confirmation
                // alert('Payment confirmed and consultation recorded!');
                // Handle post-payment success actions here
            })
            .catch(error => {
                setIsProcessingPayment(false);
                console.error('Error confirming payment:', error);
                alert('Failed to confirm payment. Please try again.');
            });
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
            {!selectedPatient ? (
                <>
                    {!searchCompleted && (
                        <PatientSearchForm setPatients={setPatients} setSearchCompleted={setSearchCompleted} />
                    )}
                    {searchCompleted && patients.data?.length > 0 && (
                        <PatientList patients={patients} selectPatient={selectPatient} />
                    )}
                </>
            ) : (
                <>
                    {showPatientDetails && (
                        <PatientDetails 
                            patient={selectedPatient} 
                            onBack={() => setSelectedPatient(null)} 
                            onContinue={handleContinue} 
                            formatDate={formatDate}
                        />
                    )}
                    {consultationType === 'follow-up' && !formSubmitted && (
                        <>
                            {showDoctorList && (
                                <DoctorList 
                                    doctors={doctors} 
                                    selectDoctor={handleDoctorSelect} 
                                />
                            )}
                            {selectedDoctor && (
                                <FollowUpForm 
                                    patient={selectedPatient} 
                                    doctors={doctors}
                                    showFeeField={showFeeField}  
                                    onSubmit={handleFormSubmit} 
                                    selectedDoctor={selectedDoctor}
                                    formatDate={formatDate}
                                />
                            )}
                        </>
                    )}
                    {consultationType === 'consultation' && !formSubmitted && (
                        <ConsultationForm 
                            patient={selectedPatient} 
                            doctors={doctors}
                            onSubmit={handleFormSubmit} 
                            formatDate={formatDate}
                        />
                    )}
                    {showQRCode && formSubmitted && (
                        <QRCodeCard 
                            qrCodeImage={qrCodeImage} 
                            fees={consultationFee} 
                            confirmPayment={confirmPayment}
                            isProcessingPayment={isProcessingPayment}
                        />
                    )}
                       {consultationResponse && (
                        <ConsultationDetails 
                            consultationResponse={consultationResponse}
                            formatDate={formatDate} // Utility function for date formatting
                            selectedPatient={selectedPatient} 
                        />
                    )}
                </>
            )}
            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSelect={handleOptionSelect} 
            />
        </div>
    );
}

export default FollowUp;
