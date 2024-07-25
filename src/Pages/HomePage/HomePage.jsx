import React, { useState } from 'react';
import './HomePage.css';
import logo from '../../assets/images/logo-01.png';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    navigate('./register');
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://giostar.onrender.com/registration/getAllRegistrations');
      setRegistrations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="content">
        <img src={logo} alt="Hospital Logo" className="logo" />
        <h4 className="title">Effortless Patient Registration</h4>
        <p className="subtitle">"From Registration to Care: Enhancing the Patient Journey"</p>
        <button className="register-btn" onClick={handleButtonClick}>Register</button>
        <button className="export-btn" onClick={fetchRegistrations}>
          <FaDownload /> Export Registrations
        </button>
        {registrations.length > 0 && (
          <CSVLink data={registrations} filename={"registrations.csv"} className="download-link">
            Download CSV
          </CSVLink>
        )}
      </div>
      <div className="background-img"></div>
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default HomePage;
