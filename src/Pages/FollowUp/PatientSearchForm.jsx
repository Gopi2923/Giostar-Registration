import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const PatientSearchForm = ({ formData, handleChange, handleSubmit, isSearching }) => (
  <div className="registration-form">
    <div className="header">
      <i className="fas fa-hospital-alt"></i>
      <h2>Patients Follow up & Consultation</h2>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="phone">Enter Mobile Number <span className="required">*</span></label>
        <input
          type="tel"
          id="phone"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          pattern="\d{10}"
          title="Please enter 10 digits"
          required
        />
      </div>
      <button type="submit" disabled={isSearching} className="search-spinner">
        {isSearching ? (
          <> <span>Searching</span> <TailSpin color="#fff" height={34} width={44} /> </>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  </div>
);

export default PatientSearchForm;
