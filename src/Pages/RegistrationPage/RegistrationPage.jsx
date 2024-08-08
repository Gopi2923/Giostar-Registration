import { useState } from 'react';
import axios from 'axios';
import QRimage from '../../assets/images/qrcode.png';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleLeft } from '@fortawesome/free-solid-svg-icons';


const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastname: '',
    age: '',
    gender: '',
    email: '',
    mobile_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfRegistration: new Date().toISOString().split('T')[0],
    doctorName: '',
    reason: '',
    typeOfVisit: 'Consultation',
  });
  const navigate = useNavigate()

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstName' || name === 'middleName' || name === 'lastName' || name === 'city' || name === 'state' || name === 'category' || name === 'reason' || name === 'doctorName') {
      const cleanedValue = value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-letter characters
      setFormData({
        ...formData,
        [name]: cleanedValue,
      });
    } else if (name === 'mobile_number') {
      const cleanedValue = value.replace(/\D/g, ''); // Remove non-digit characters
      if (cleanedValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: cleanedValue,
        });
      }
    } else if (name === 'age') {
      const ageValue = value.replace(/\D/g, ''); // Remove non-digit characters
      if (ageValue.length <= 3) {
        setFormData({
          ...formData,
          [name]: ageValue,
        });
      }
    } else if (name === 'pincode') {
      const pincodeValue = value.replace(/\D/g, ''); // Remove non-digit characters
      if (pincodeValue.length <= 6) {
        setFormData({
          ...formData,
          [name]: pincodeValue,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Update the isSubmitted state to show the QR code
    setIsSubmitted(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      const paymentResponse = await axios.post('https://giostar.onrender.com/registration/add', formData);
      console.log('Payment Response:', paymentResponse.data);

      // Set the paymentConfirmed state and responseData
      setPaymentConfirmed(true);
      setResponseData(paymentResponse.data);
      setShowModal(true); // Show the modal
    } catch (error) {
      console.log('There was an error!', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className='registration-container'>
      <button className="back-btn" onClick={() => navigate('/')}><FontAwesomeIcon icon={faCircleLeft} beat style={{color: "#FFD43B",}}/> Back to Home</button>
      <div className="registration-form">
        <div className="header">
          <i className="fas fa-hospital-alt"></i>
          <h2>Patient Registration</h2>
        </div>
        {isSubmitted ? (
          <div className="qr-code-container">
            {!paymentConfirmed ? (
              <div className="qr-code-card">
                <h2>Total Amount: 300 /-</h2>
                <h2>Scan to Pay</h2>
                <img src={QRimage} alt="QR" width={'280px'} height={'250px'} />
                <button onClick={handlePaymentConfirm} type='submit'>Confirm Payment</button>
                <p>* Note: Please ensure payment fee amount with frontdesk person.</p>
              </div>
            ) : (
              responseData && (
                <div className="response-details">
                  <h1>Payment Confirmed</h1>
                  <div className="patient-details">
                    {responseData.patientId && <p><strong>Patient ID:</strong> {responseData.patientId}</p>}
                    {responseData.firstName && <p><strong>Name:</strong> {responseData.firstName} {responseData.middleName || ''} {responseData.lastname || ''}</p>}
                    {responseData.age && <p><strong>Age:</strong> {responseData.age}</p>}
                    {responseData.gender && <p><strong>Gender:</strong> {responseData.gender}</p>}
                    {responseData.email && <p><strong>Email:</strong> {responseData.email}</p>}
                    {responseData.mobile_number && <p><strong>Mobile Number:</strong> {responseData.mobile_number}</p>}
                    {responseData.address && <p><strong>Address:</strong> {responseData.address}</p>}
                    {responseData.city && <p><strong>City:</strong> {responseData.city}</p>}
                    {responseData.state && <p><strong>State:</strong> {responseData.state}</p>}
                    {responseData.pincode && <p><strong>Pincode:</strong> {responseData.pincode}</p>}
                    {responseData.createdAt && <p><strong>Date of Registration:</strong> {formatDate(responseData.createdAt)}</p>}
                    {responseData.reason && <p><strong>Reason for Visit:</strong> {responseData.reason}</p>}
                    {responseData.typeOfVisit && <p><strong>Type of Visit:</strong> {responseData.typeOfVisit}</p>}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group name-group">
                <div className='form-group'>
                  <label htmlFor="firstName">First Name <span className="required">*</span></label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className='form-group'>
                  <label htmlFor="middleName">Middle Name</label>
                  <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                  <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="age">Age <span className="required">*</span></label>
                <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender <span className="required">*</span></label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email ID <span className="required">*</span></label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Mobile Number <span className="required">*</span></label>
                <input type="tel" id="phone" name="mobile_number" value={formData.mobile_number} onChange={handleChange} pattern="\d{10}" title="Please enter 10 digits" required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="category">Pincode</label>
                <input type="text" id="pincode" name="pincode"  value={formData.pincode} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date of Registration <span className="required">*</span></label>
                <input type="date" id="date" name="dateOfRegistration" value={formData.dateOfRegistration} onChange={handleChange} 
                    style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} readOnly required />
              </div>
              <div className="form-group">
                <label htmlFor="doctorName">Doctor Name <span className="required">*</span></label>
                <input id="doctorName" name="doctorName" value={formData.doctorName} onChange={handleChange} required></input>
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason for Visit</label>
                <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="typeOfVisit">Type of Visit <span className="required">*</span></label>
                <select id="typeOfVisit" name="typeOfVisit" value={formData.typeOfVisit} onChange={handleChange} required>
                  <option value="consultation">Consultation</option>
                </select>
              </div>
              <button type="submit">Submit</button>
            </form>
          </>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Payment is done</h2>
            <p>Thank you for your registration!</p>
            <div className="success-icon"><FontAwesomeIcon icon={faCircleCheck} /> </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
