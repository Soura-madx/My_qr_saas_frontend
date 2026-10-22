import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Instagram, Star } from "lucide-react";
import ReviewModal from "../pages/ReviewModal";
const PaymentScreen = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // Payment and Modal States
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Backend se business data fetch karna
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/business/${slug}`);
        const data = await res.json();
        if (res.ok) setBusiness(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug]);

  // Page Visibility API trick - Payment ke baad wapas aane par popup
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && hasInitiatedPayment) {
        setShowReviewModal(true);
        setHasInitiatedPayment(false); // reset kar diya
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasInitiatedPayment]);

  const handleUPIPayment = () => {
    if (!amount || amount <= 0) return alert("Please enter a valid amount");

    // Mobile device par native UPI app open karega
    const upiUrl = `upi://pay?pa=${business.upiId}&pn=${business.name}&am=${amount}&cu=INR`;
    window.location.href = upiUrl;

    // Track kiya ki user payment karne gaya hai
    setHasInitiatedPayment(true);
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  if (!business)
    return (
      <div className="text-center mt-20 text-red-500">Business not found!</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Main Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 mt-10 text-center border-t-4 border-blue-600">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {business.name}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter amount to pay via any UPI App
        </p>

        {/* Amount Input */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-3 text-xl font-bold text-gray-700">
            ₹
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 text-2xl border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        {/* Pay Button */}
        <button
          onClick={handleUPIPayment}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all text-lg mb-6"
        >
          Pay via UPI
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Quick Actions (For Cash Customers) */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            <Star size={18} className="text-yellow-500" /> Review
          </button>

          {business.instagramHandle && (
            <a
              href={`https://instagram.com/${business.instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg font-medium hover:bg-pink-100 transition"
            >
              <Instagram size={18} /> Follow us
            </a>
          )}
        </div>
      </div>

      {/* Placeholder for Review Modal (Jo hum next step me banayenge) */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold mb-4">
              Review Modal (Coming Next)
            </h3>
            <button
              onClick={() => setShowReviewModal(false)}
              className="text-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        business={business}
      />
    </div>
  );
};

export default PaymentScreen;
