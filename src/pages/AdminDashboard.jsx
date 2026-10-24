import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaSignOutAlt, FaQrcode, FaDownload, FaFilter } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const AdminDashboard = () => {
  const [business, setBusiness] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return navigate("/login");

      try {
        // 1. Fetch Business Info
        const busRes = await fetch("https://my-qr-saas-backend.onrender.com/api/business/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        // 🚨 NAYA LOGIC: Agar 404 aaya (matlab naya user hai), toh Register Business par bhejo
        if (busRes.status === 404) {
          navigate("/admin/register");
          return; 
        }

        const busData = await busRes.json();
        
        if (busRes.ok && busData.business) {
          setBusiness(busData.business);
          
          // 2. Fetch Feedbacks using Business ID
          const feedRes = await fetch(`https://my-qr-saas-backend.onrender.com/api/business/${busData.business._id}/feedbacks`);
          const feedData = await feedRes.json();
          if (feedRes.ok) setFeedbacks(feedData.feedbacks);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const downloadQR = () => {
    const canvas = document.getElementById("dashboard-qr");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${business.slug}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Dashboard...</div>;
  
  if (!business) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
      <p className="text-gray-600">No business linked to this account.</p>
      <button onClick={() => navigate("/admin/register")} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">
  Register Business
</button>
    </div>
  );

  const totalReviews = feedbacks.length;
  const averageRating = totalReviews > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) 
    : 0;

  // Filter Logic
  const filteredFeedbacks = feedbacks.filter(fb => 
    ratingFilter === "all" ? true : fb.rating === parseInt(ratingFilter)
  );

  const qrUrl = `${window.location.origin}/b/${business.slug}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">QR Reputation Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition">
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header & QR Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-md">
              {business.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{business.name}</h2>
              <a href={`/b/${business.slug}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-medium hover:underline">
                Live QR Page: /b/{business.slug}
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setShowQR(!showQR)} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium">
              <FaQrcode /> {showQR ? "Hide QR" : "Show QR"}
            </button>
            <button onClick={() => window.location.href = business.googleReviewLink} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition font-medium">
              Open Google Reviews
            </button>
          </div>
        </div>

        {/* Hidden QR Code Box */}
        {showQR && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col items-center justify-center fade-in">
            <QRCodeCanvas id="dashboard-qr" value={qrUrl} size={180} level={"H"} includeMargin={true} />
            <button onClick={downloadQR} className="mt-4 flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">
              <FaDownload /> Download QR Code
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Private Feedbacks</p>
            <h3 className="text-4xl font-bold text-gray-800">{totalReviews}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Average Rating</p>
            <div className="flex items-center gap-2">
              <h3 className="text-4xl font-bold text-gray-800">{averageRating}</h3>
              <FaStar className="text-yellow-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Feedbacks Section with Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Recent Feedbacks
            </h3>
            
            {/* Star Rating Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <FaFilter className="text-gray-400 mr-1" />
              {["all", "1", "2", "3", "4", "5"].map(star => (
                <button 
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                    ratingFilter === star 
                    ? "bg-gray-800 text-white shadow-md" 
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {star === "all" ? "All Stars" : `${star} Star`}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback List */}
          <div className="p-0">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FaStar className="text-gray-300 text-2xl" />
                </div>
                <p className="text-gray-500 font-medium">No feedback found for this filter.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredFeedbacks.map((review, index) => (
                  <div key={index} className="p-6 hover:bg-blue-50/50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} size={14} />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-800 text-[15px] leading-relaxed">
                      {review.feedbackText || <span className="text-gray-400 italic">No written feedback provided.</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;