import React from 'react'
import './HomePage.css'
import logo from '../../assets/logo-01.png'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
   const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('./register')  
  }

  return (
    <div className='home-page'>
       <img src={logo} alt="Hospital Logo" className='logo'/>
       <button className='register-btn' onClick={handleButtonClick}>Register</button>
    </div>
  )
}

export default HomePage
