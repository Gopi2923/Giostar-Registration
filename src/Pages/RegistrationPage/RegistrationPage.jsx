import {useState} from 'react';
import axios from 'axios';
import './RegistrationPage.css';

const RegistrationPage = () => {

  const [formData, setFormData] = useState({
     firstName: '',
     middleName: '',
     lastName: '',
     age: '',
     gender: '',
     email: '',
     phone: '',
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
          <label htmlFor="phone">Phone No</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
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
    </div>
  );
};

export default RegistrationPage;
