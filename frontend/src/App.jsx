import React from 'react';
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Profile from './components/Profile';

function App() {
  return (
   <div>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}> </Route>
        <Route path="/register" element={<RegistrationPage/>}/>
        <Route path="profile" element={<Profile/>}/>
      </Routes>
     </BrowserRouter>

   </div>
  );
}

export default App;
