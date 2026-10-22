import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate aur Link import kiya

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook initialize kiya

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://my-qr-saas-backend.onrender.com/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard'); // Page bina reload hue smoothly redirect hoga
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server connection error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        
        {error && (
          <div className="p-3 rounded-lg mb-4 text-sm font-medium bg-red-50 text-red-700 text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </div>

        {/* Naya Signup page link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/admin/signup" className="text-blue-600 font-bold hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;