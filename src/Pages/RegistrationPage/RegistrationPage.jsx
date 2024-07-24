import {useState} from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './RegistrationPage.css';

const RegistrationPage = () => {

  const [upiLink, setUpiLink] = useState('');
  const [transactionId, setTransactionId] = useState('');
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
     typeOfVisit: ''
  });

  const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const formResponse = await axios.post('https://giostar.onrender.com/registration/add', formData);
      const orderId = formResponse.data.patientId
      console.log('Response:', formResponse.data)

      const token = '367|qM5tv66Rhk8Tm13DlvDkc92KNwVMvAhOuljLB8tA';
      const transactionData = {
        amount: '1',
        description: 'laddu',
        name: formData.firstName,
        email: 'dhanushnm07@gmail.com',
        mobile: Number(formData.mobileNumber),
        enabledModesOfPayment: 'upi',
        payment_method: 'UPI_INTENT',
        source: 'api',
        order_id: orderId, // Use the order_id received from the create receipt API
        user_uuid: 'swp_sm_903dd099-3a9e-4243-ac1e-f83f83c30725',
        other_info: 'api',
        encrypt_response: 0
      };

      const formData2 = new FormData();
      for (const key in transactionData) {
        formData2.append(key, transactionData[key]);
      }

      const transactionResponse = await axios.post('https://www.switchpay.in/api/createTransaction', formData2, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
 
      const { upi_intent_link, transaction_id } = transactionResponse.data;
      setUpiLink(upi_intent_link);
      setTransactionId(transaction_id);

      // Third API call to update the transactionId and orderId
      await axios.post('https://ssrvd.onrender.com/payment-gateway/update/transactionId/orderId', {
        order_id: orderId,
        transaction_id: transaction_id
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
    } catch(error) {
      console.log('There was an error!',error)
    }
  }
  return (
    <div className="registration-form">
      <div className="header">
        <i className="fas fa-hospital-alt"></i>
        <h2>Patient Registration</h2>
      </div>
      {!upiLink ? (
      <form onSubmit={handleSumbit}>
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
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Mobile Number</label>
          <input type="tel" id="phone" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
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
          <input type="text" id="state" name="state" value={formData.state} onChange={handleChange}/>
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
      ) : (
        <div className="qr-code-container">
        <div className="qr-code-card">
          <h2>Total Amount: 300 /-</h2>
          <h2>Scan to Pay</h2>
          <QRCode value={upiLink} size={256} />
        </div>
      </div>
      
      )}
    </div>
  );
};

export default RegistrationPage;
