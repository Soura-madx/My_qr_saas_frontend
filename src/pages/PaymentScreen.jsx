import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaInstagram, FaStar } from 'react-icons/fa';
import ReviewModal from "../pages/ReviewModal";

const PaymentScreen = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Backend se business data fetch karna
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        // Fix: Hardcoded Render URL ki jagah environment variable use kiya
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/business/${slug}`);
        const data = await res.json();
        
        if (res.ok) {
          setBusiness(data);
        } else {
          setBusiness(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchBusiness();
  }, [slug]);

  // Page Visibility API trick
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && hasInitiatedPayment) {
        setShowReviewModal(true);
        setHasInitiatedPayment(false); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasInitiatedPayment]);

  const handleUPIPayment = () => {
    if (!amount || amount <= 0) return alert("Please enter a valid amount");

    const upiUrl = `upi://pay?pa=${business.upiId}&pn=${business.name}&am=${amount}&cu=INR`;
    window.location.href = upiUrl;
    setHasInitiatedPayment(true);
  };

  if (loading) return <div className="text-center mt-20 text-gray-500 font-medium">Loading Business...</div>;
  
  if (!business) return (
    <div className="text-center mt-20 p-4">
      <h2 className="text-2xl font-bold text-red-500 mb-2">Business not found!</h2>
      <p className="text-gray-600">Please check if the QR link is correct.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 mt-10 text-center border-t-4 border-blue-600">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{business.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Enter amount to pay via any UPI App</p>

        <div className="relative mb-6">
          <span className="absolute left-4 top-3 text-xl font-bold text-gray-700">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 text-2xl border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <button
          onClick={handleUPIPayment}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all text-lg mb-6"
        >
          Pay via UPI
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition"
          >
             <FaStar color="#ffc107" size={18} /> Review
          </button>

          {business.instagramHandle && (
            <a
              href={`https://instagram.com/${business.instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg font-medium hover:bg-pink-100 transition"
            >
              <FaInstagram size={24} /> Follow us
            </a>
          )}
        </div>
      </div>

      {/* Actual Review Modal - Extra placeholder hata diya gaya hai */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        business={business}
      />
    </div>
  );
};

export default PaymentScreen;