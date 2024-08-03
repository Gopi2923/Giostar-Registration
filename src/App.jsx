import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import RegistrationPage from './Pages/RegistrationPage/RegistrationPage';
import FollowUp from './Pages/FollowUp/FollowUp';


function App() {
 

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/register' element={<RegistrationPage />}></Route>
        <Route path='/followup' element={<FollowUp />}></Route>
      </Routes>
    </Router>
  )
}

export default App
