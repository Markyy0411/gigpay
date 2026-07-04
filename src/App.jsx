import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <TaskProvider>
        <Router>
          <div className="container">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/client" element={<ClientDashboard />} />
              <Route path="/freelancer" element={<FreelancerDashboard />} />
            </Routes>
          </div>
        </Router>
      </TaskProvider>
    </ToastProvider>
  );
}

export default App;
