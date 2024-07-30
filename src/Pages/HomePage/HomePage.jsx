import React, { useState } from 'react';
import './HomePage.css';
import logo from '../../assets/images/logo-01.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import ParticlesBg from 'particles-bg';

const HomePage = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleButtonClick = () => {
    navigate('./register');
  };

  const fetchRegistrations = async () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy/MM/dd');
      const response = await axios.post('https://giostar.onrender.com/registration/getAll', {
        createdAt: formattedDate
      });

      const data = response.data.data;

      if (!data || data.length === 0) {
        toast.error(response.data.message || 'Empty Registrations');
      } else {
        const filteredData = data.map(({ _id, isRegistered, updatedAt, __v, address, city, state, pincode, reason, typeOfVisit, middleName, lastname, ...rest }) => rest);
        setRegistrations(filteredData);
        exportToCSV(filteredData);
        setModalIsOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching registrations';
      toast.error(errorMessage);
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoading(false);
      setSelectedDate(null);
    }
  };

  const exportToCSV = (data) => {
    const headers = [
      { label: 'Name', key: 'firstName' },
      { label: 'Age', key: 'age' },
      { label: 'Gender', key: 'gender' },
      { label: 'Email', key: 'email' },
      { label: 'Mobile Number', key: 'mobile_number' },
      { label: 'Date of Registration', key: 'createdAt' },
      { label: 'Patient ID', key: 'patientId' },
    ];

    const worksheetData = data.map(item => {
      const row = {};
      headers.forEach(header => {
        if (header.key === 'createdAt') {
          row[header.label] = format(new Date(item[header.key]), 'dd-MM-yyyy');
        } else {
          row[header.label] = item[header.key];
        }
      });
      return row;
    });

    // Add the headers to the worksheet data
    worksheetData.unshift(headers.reduce((acc, header) => {
      acc[header.label] = header.label;
      return acc;
    }, {}));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    worksheet['!cols'] = [
      { wpx: 150 }, // Increase width for 'Name'
      { wpx: 50 },
      { wpx: 100 },
      { wpx: 200 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 150 },
    ];

    // Apply alignment to all cells
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!worksheet[cell_ref]) continue;
        worksheet[cell_ref].s = {
          alignment: {
            vertical: 'center',
            horizontal: 'center'
          }
        };
      }
    }

    // Setting headers style
    headers.forEach((header, index) => {
      const cell_address = { c: index, r: 0 };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (worksheet[cell_ref]) {
        worksheet[cell_ref].s = {
          alignment: {
            vertical: 'center',
            horizontal: 'center'
          },
          font: {
            bold: true
          }
        };
      }
    });

    XLSX.writeFile(workbook, 'registrations.xlsx');
  };

  return (
    <div className="home-page">
      <ParticlesBg type="square" bg={true} />
      <div className="content">
        <img src={logo} alt="Hospital Logo" className="logo" />
        <h4 className="title">Effortless Patient Registration</h4>
        <p className="subtitle">"From Registration to Care: Enhancing the Patient Journey"</p>
        <button className="register-btn" onClick={handleButtonClick}>Register</button>
        <button className="export-btn" onClick={() => setModalIsOpen(true)}>
          {isLoading ? (
            <div className="spinner-container">
              Loading <TailSpin color="#fff" height={24} width={24} />
            </div>
          ) : (
            <><FaDownload /> Export Registrations</>
          )}
        </button>
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

      <ToastContainer />
    </div>
  );
};

export default HomePage;
