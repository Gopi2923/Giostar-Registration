import React from 'react'
import './HomePage.css'
import logo from '../../assets/logo-01.png'
import { useNavigate } from 'react-router-dom'
import backgroundimg from '../../assets/background-image.jpg'

const HomePage = () => {
   const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('./register')  
  }

  return (
    <div className='home-page'>
      <div className='content'>
       <img src={logo} alt="Hospital Logo" className='logo'/>
        <h1 className="title">Effortless Patient Registration</h1>
        <p className="subtitle">"From Registration to Care: Enhancing the Patient Journey"</p>
       <button className='register-btn' onClick={handleButtonClick}>Register</button>
       </div>
       <div className='background-img'></div>
    </div>
  )
}

export default HomePage
