import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentScreen from './pages/PaymentScreen';
import AdminRegister from './pages/AdminRegister'; // Naya import

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Route */}
        <Route path="/admin" element={<AdminRegister />} />
        
        {/* Customer Scan Route */}
        <Route path="/b/:slug" element={<PaymentScreen />} />
        
        {/* Home/Fallback */}
        <Route path="/" element={<div className="p-4 text-center mt-10 font-bold text-xl">Workiees QR SaaS System</div>} />
      </Routes>
    </Router>
  );
}

export default App;