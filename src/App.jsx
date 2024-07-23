import { useState } from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'


function App() {
 

  return (
    <Router>
      <Switch>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/' element={''}></Route>
      </Switch>
    </Router>
  )
}

export default App
