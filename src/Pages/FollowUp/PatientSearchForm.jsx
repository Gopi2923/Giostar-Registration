import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';


const PatientSearch = ({ setPatients, setSearchCompleted }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const searchPatient = async (event) => {
        event.preventDefault();
        setIsSearching(true);
        try {
            const response = await axios.post('https://giostar.onrender.com/registration/getByMobileNumber', {
                mobile_number: mobileNumber
            });
            
            if (response.data.data && response.data.data.length > 0) {
                setPatients(response.data);
                setSearchCompleted(true);
            } else {
                toast.error('Patient not found.');
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
            toast.error('Patient not found.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        // Only allow numbers
        if (/^\d*$/.test(value)) {
            setMobileNumber(value);
        }
    };
    return (
        <div className='registration-form'>
            <div className="header">
                <i className="fas fa-hospital-alt"></i>
                <h2>Patients Follow up & Consultation</h2>
            </div>
            <div className='form-group'>
                <form onSubmit={searchPatient}>
                    <label htmlFor="phone">Enter Mobile Number <span className="required">*</span></label>
                    <input 
                        type="tel" 
                        value={mobileNumber} 
                        onChange={handleInputChange} 
                        pattern="\d{10}"
                        maxLength="10"
                        required 
                    />
                    <button type='submit' disabled={isSearching}>
                        {isSearching ? <> <span>Searching</span>  <TailSpin color="#fff" height={34} width={44}/> </>: 'Search'}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PatientSearch;
