import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import RegistrationPage from './Pages/RegistrationPage/RegistrationPage';


function App() {
 

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/register' element={<RegistrationPage />}></Route>
      </Routes>
    </Router>
  )
}

export default App
