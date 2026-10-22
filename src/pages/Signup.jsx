import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`http://localhost:5000/api/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        // Token save karein aur seedha business register page par bhej dein
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard'); 
      } else {
        setStatus({ type: 'error', message: data.message || 'Signup failed!' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server connection error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Start managing your business reviews</p>
        
        {status.message && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {status.message}
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" name="password" placeholder="Create Password" required value={formData.password} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/admin/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;