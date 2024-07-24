import { useState } from 'react';
import axios from 'axios';
import QRimage from '../../assets/images/QR code img.jpeg';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: '',
    category: '',
    date: '',
    reason: '',
    typeOfVisit: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstName') {
      const cleanedValue = value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-letter characters
      setFormData({
        ...formData,
        [name]: cleanedValue,
      });
    } else if (name === 'mobileNumber') {
      const cleanedValue = value.replace(/\D/g, ''); // Remove non-digit characters
      if (cleanedValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: cleanedValue,
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
    } catch (error) {
      console.log('There was an error!', error);
    }
  };

  return (
    <div className='registration-container'>
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
              <img src={QRimage} alt="QR" width={'250px'} height={'250px'} />
              <button onClick={handlePaymentConfirm} type='submit'>Confirm Payment</button>
            </div>
          ) : (
            responseData && (
              <div className="response-details">
                <h1>Payment Confirmed</h1>
                <div className="patient-details">
                  <p><strong>Patient ID:</strong> {responseData.patientId}</p>
                  <p><strong>Name:</strong> {responseData.firstName} {responseData.middleName} {responseData.lastName}</p>
                  <p><strong>Age:</strong> {responseData.age}</p>
                  <p><strong>Gender:</strong> {responseData.gender}</p>
                  <p><strong>Email:</strong> {responseData.email}</p>
                  <p><strong>Mobile Number:</strong> {responseData.mobileNumber}</p>
                  <p><strong>Address:</strong> {responseData.address}</p>
                  <p><strong>City:</strong> {responseData.city}</p>
                  <p><strong>State:</strong> {responseData.state}</p>
                  <p><strong>Category:</strong> {responseData.category}</p>
                  <p><strong>Date of Registration:</strong> {responseData.date}</p>
                  <p><strong>Reason for Visit:</strong> {responseData.reason}</p>
                  <p><strong>Type of Visit:</strong> {responseData.typeOfVisit}</p>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-group name-group">
              <div>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="middleName">Middle Name</label>
                <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email ID</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Mobile Number</label>
              <input type="tel" id="phone" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} pattern="\d{10}" title="Please enter 10 digits" required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input type="text" id="category" name="category" placeholder="Example: Hospital Branch / Department / Section" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date of Registration</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason for Visit</label>
              <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="typeOfVisit">Type of Visit</label>
              <select id="typeOfVisit" name="typeOfVisit" value={formData.typeOfVisit} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="consultation">Consultation</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
    </div>
  );
};

export default RegistrationPage;
