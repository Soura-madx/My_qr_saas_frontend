import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    upiId: '',
    googleReviewLink: '',
    instagramHandle: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(''); // Naya state QR url ke liye

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });
    setGeneratedUrl('');

    try {
      const response = await fetch('https://my-qr-saas-backend.onrender.com/api/business/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Business Registered Successfully!' });
        // Real app me localhost ki jagah aapka live domain aayega
        setGeneratedUrl(`https://my-qr-saas-backend.onrender.com/b/${formData.slug}`);
      } else {
        setStatus({ type: 'error', message: data.message || 'Registration failed' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Server connection error' });
    } finally {
      setIsLoading(false);
    }
  };

  // QR Code Download Karne Ka Function
  const downloadQRCode = () => {
    const canvas = document.getElementById('business-qr-code');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${formData.slug}-payment-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 border-t-4 border-gray-800">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Register New Business</h1>
        <p className="text-sm text-gray-500 mb-6">Create a QR link for a new client.</p>

        {status.message && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.message}
          </div>
        )}

        {/* Agar URL generate ho gaya hai toh form chupakar QR dikhayenge */}
        {generatedUrl ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl">
              <QRCodeCanvas 
                id="business-qr-code" 
                value={generatedUrl} 
                size={200} 
                level={"H"} 
                includeMargin={true}
              />
            </div>
            <p className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded w-full text-center break-all">
              {generatedUrl}
            </p>
            <div className="flex w-full gap-3 mt-4">
              <button 
                onClick={downloadQRCode}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Download QR
              </button>
              <button 
                onClick={() => {
                  setGeneratedUrl('');
                  setFormData({ name: '', slug: '', upiId: '', googleReviewLink: '', instagramHandle: '' });
                  setStatus({ type: '', message: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Add Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g., Cafe Mocha" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom URL Slug (No spaces)</label>
              <input type="text" name="slug" required value={formData.slug} onChange={handleChange} placeholder="e.g., cafe-mocha" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (For Payments)</label>
              <input type="text" name="upiId" required value={formData.upiId} onChange={handleChange} placeholder="e.g., owner@okaxis" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Review Link</label>
              <input type="url" name="googleReviewLink" required value={formData.googleReviewLink} onChange={handleChange} placeholder="https://g.page/r/..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle (Optional)</label>
              <input type="text" name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} placeholder="e.g., cafe_mocha_official" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-70 mt-4">
              {isLoading ? 'Registering...' : 'Generate QR Code'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminRegister;