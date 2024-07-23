import React from 'react'
import './HomePage.css'
import logo from '../../assets/logo-01.png'


const HomePage = () => {
  return (
    <div className='home-page'>
       <img src={logo} alt="Hospital Logo" className='logo'/>
       <button className='register-btn'>Register</button>
    </div>
  )
}

export default HomePage
