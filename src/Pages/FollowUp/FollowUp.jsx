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
    const [selctedDoctorId, setSelectedDoctorId] = useState('');
    const [submittedFormData, setSubmittedFormData] = useState(null);

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
        const endpoint = type === 'FollowUp'
            ? 'https://giostar.onrender.com/consultation/doctorsList'
            : 'https://giostar.onrender.com/doctor-info/getAll';

        axios.post(endpoint, { patientRef: selectedPatient._id })
            .then(response => {
                setDoctors(response.data.data);
                setSelectedDoctor(null);
                setShowFeeField(type === 'FollowUp' ? false : true);
                if (type === 'FollowUp') {
                    setShowDoctorList(true); 
                }
            })
            .catch(error => {
                console.error('Error fetching doctor list:', error);
                setDoctors([]); 
                setShowDoctorList(true);
            });
    };

    const handleDoctorSelect = (doctor) => {
        console.log('Doctor selected:', doctor);
        setSelectedDoctor(doctor);
        setShowDoctorList(false); 
    };

    useEffect(() => {
        if (consultationType === 'FollowUp' && selectedDoctor) {
            axios.get(`https://giostar.onrender.com/consultation/checkFollowUp/${selectedDoctor.patientRef}/${selectedDoctor.doctorRef}`)
                .then(response => {
                    setShowFeeField(!response.data.data); 
                })
                .catch(error => {
                    console.error('Error checking FollowUp:', error);
                });
        }
    }, [consultationType, selectedDoctor]);

    const handleFormSubmit = (formData) => {
        if (showFeeField) {
            setConsultationFee(formData.fees); 
            setSelectedDoctorId(formData.doctorRef);
            setQrCodeImage('./../../assets/images/QR code img.jpeg'); 
            setShowQRCode(true);
        } else {
            submitFormData(formData);
        }
        setFormSubmitted(true);
        setSubmittedFormData(formData);
    };

    const submitFormData = (formData) => {
        setIsProcessingPayment(true);
        const payload = {
            patientId: selectedPatient.patientId,
            patientRef: selectedPatient._id,
            doctorRef: formData.doctorRef,
            reason: formData.reason,
            fees: formData.fees,
            status: formData.fees === "No fee" ? "No fee" : "Paid",
            type: consultationType,
            doctorName: formData.doctorName,
            dateOfConsultation: new Date().toISOString().split('T')[0],
        };

        axios.post('https://giostar.onrender.com/consultation/add', payload)
            .then(response => {
                setIsProcessingPayment(false);
                setConsultationResponse(response.data);
                setShowQRCode(false);
            })
            .catch(error => {
                setIsProcessingPayment(false);
                console.error('Error confirming payment:', error);
                alert('Failed to confirm payment. Please try again.');
            });
    };

    const confirmPayment = () => {
        if (!submittedFormData) return;
        submitFormData(submittedFormData);
    };
    
    console.log('res',consultationResponse)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      console.log("_id",selctedDoctorId)
      console.log('docName', submittedFormData)
      console.log('obj', selectedDoctor)
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
                    {consultationType === 'FollowUp' && !formSubmitted && (
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
                    {consultationType === 'Consultation' && !formSubmitted && (
                        <ConsultationForm 
                            patient={selectedPatient} 
                            doctors={doctors}
                            onSubmit={handleFormSubmit} 
                            formatDate={formatDate}
                            selectedDoctor={selectedDoctor}
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
