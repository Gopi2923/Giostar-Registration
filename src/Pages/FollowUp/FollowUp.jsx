import React, { useState } from 'react';
import './FollowUp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const FollowUp = () => {
  const [formData, setFormData] = useState({
    mobile_number: "",
  });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile_number') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: cleanedValue,
        });
      }
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
      } else {
        alert('Patient registration verification failed.');
      }
    } catch (error) {
      console.error('Error verifying patient registration:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className='registration-container'>
      <button className="back-btn" onClick={() => navigate('/')}>Back to Home</button>
      {selectedPatient ? (
        <div className="patient-details">
          <h2>Patient Details</h2>
          <p><strong>Name:</strong> {`${selectedPatient.firstName} ${selectedPatient.lastname}`}</p>
          <p><strong>Mobile Number:</strong> {selectedPatient.mobile_number}</p>
          <p><strong>Email:</strong> {selectedPatient.email}</p>
          <p><strong>Age:</strong> {selectedPatient.age}</p>
          <p><strong>Gender:</strong> {selectedPatient.gender}</p>
          <p><strong>Date of Registration:</strong> {new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
          <button onClick={() => setSelectedPatient(null)}>Back to List</button>
        </div>
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
                  {`${patient.firstName} ${patient.lastname}`} - {patient.mobile_number}
                  <FontAwesomeIcon icon={faArrowRight} />
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default FollowUp;
