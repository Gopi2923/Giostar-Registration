import React from 'react';
import './RegistrationPage.css';

const RegistrationPage = () => {
  return (
    <div className="registration-form">
      <div className="header">
        <i className="fas fa-hospital-alt"></i>
        <h2>Patient Registration</h2>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name</label>
          <input type="text" id="patientName" name="patientName" placeholder="First name, Middle name, Last name" required />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" name="age" required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" required>
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email ID</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone No</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" required />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" required />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input type="text" id="state" name="state" />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" placeholder="Example: Hospital Branch / Department / Section" required />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date of Registration</label>
          <input type="date" id="date" name="date" required />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason for Visit</label>
          <textarea id="reason" name="reason"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="typeOfVisit">Type of Visit</label>
          <select id="typeOfVisit" name="typeOfVisit" required>
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
