import React, { useState, useRef, useEffect } from 'react';
import './HomePage.css';
import logo from '../../assets/images/logo-01.png';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const HomePage = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const csvLinkRef = useRef(null);

  const handleButtonClick = () => {
    navigate('./register');
  };

  const fetchRegistrations = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = format(selectedDate, 'yyyy/MM/dd');
      const response = await axios.post('https://giostar.onrender.com/registration/getAll', {
        createdAt: formattedDate
      });
      const data = response.data.data; // assuming response.data.data contains the array of registrations
      
      // Filter out unwanted columns here
      const filteredData = data.map(({ _id, isRegistered, updatedAt, __v, address, city, state, pincode, reason, typeOfVisit, middleName, lastname, ...rest }) => rest);

      setRegistrations(filteredData);
      setFilteredRegistrations(filteredData);
      setModalIsOpen(false); // Close the modal
    } catch (error) {
      setError('Error fetching registrations');
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filteredRegistrations.length > 0) {
      csvLinkRef.current.link.click();
    }
  }, [filteredRegistrations]);

  // Define CSV headers
  const csvHeaders = [
    { label: 'Name', key: 'firstName' },
    { label: 'Age', key: 'age' },
    { label: 'Gender', key: 'gender' },
    { label: 'Email', key: 'email' },
    { label: 'Mobile Number', key: 'mobile_number' },
    { label: 'Date of Registration', key: 'createdAt' }, // Adjusted to use the 'createdAt' key
    { label: 'Patient ID', key: 'patientId' },
  ];

  return (
    <div className="home-page">
      <div className="content">
        <img src={logo} alt="Hospital Logo" className="logo" />
        <h4 className="title">Effortless Patient Registration</h4>
        <p className="subtitle">"From Registration to Care: Enhancing the Patient Journey"</p>
        <button className="register-btn" onClick={handleButtonClick}>Register</button>
        <button className="export-btn" onClick={() => setModalIsOpen(true)}>
          {isLoading ? <> Loading <TailSpin color="#fff" height={34} width={44}/> </> : <><FaDownload /> Export Registrations</>}
        </button>
        <CSVLink
          data={filteredRegistrations}
          headers={csvHeaders}
          filename={"registrations.csv"}
          className="download-link"
          ref={csvLinkRef}
        />
      </div>
      <div className="background-img"></div>

      <div id="myModal" className="modal" style={{ display: modalIsOpen ? 'block' : 'none' }}>
        <div className="modal-content">
          <span className="close" onClick={() => setModalIsOpen(false)}>&times;</span>
          <h2>Select a Date</h2>
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              placeholderText="Select a date"
              dateFormat="yyyy/MM/dd"
              className="date-input"
            />
          </div>
          <button className="download-btn" onClick={fetchRegistrations} disabled={isLoading}>
            {isLoading ? (
              <div className="spinner-container">
                Loading <TailSpin color="#fff" height={24} width={24} />
              </div>
            ) : (
              "Download"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
