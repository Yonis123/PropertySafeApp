import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import HomePage from './Pages/HomePage';
import OfficerPortalPage from './Pages/OfficerPortalPage';
import PMPortal from './Pages/PMPortal';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateAccount from './Pages/CreateAccount'; 
import PMDashboard from './Pages/PM-dashboard';
import PM_Reports from './Pages/PM-reports';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pm-portal" element={<PMPortal />} />
        <Route path="/officer-portal-page" element={<OfficerPortalPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/PM-dashboard" element={<PMDashboard/>} />
        <Route path="/PM-reports" element={<PM_Reports/>} />
      </Routes>
    </Router>
    
  );
}

export default App;