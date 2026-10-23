import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaGlobe, FaStar } from 'react-icons/fa';

const CustomerReview = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review States
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`https://my-qr-saas-backend-onrender.com/api/business/${slug}`);
        const data = await res.json();
        if (res.ok) setBusiness(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBusiness();
  }, [slug]);

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please give a star rating first!");
    // Yeh API hum aage wale steps me properly connect karenge
    alert(`Rating: ${rating} Star, Feedback: ${feedbackText} \nSubmitted!`);
  };

  const getRatingText = () => {
    switch (hover || rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  if (loading) return <div className="min-h-screen bg-[#202124] flex items-center justify-center text-white">Loading...</div>;
  if (!business) return <div className="min-h-screen bg-[#202124] flex items-center justify-center text-red-400">Business not found!</div>;

  return (
    <div className="min-h-screen bg-[#202124] text-[#e8eaed] font-sans flex flex-col items-center">
      
      {/* Header Section */}
      <div className="w-full max-w-md px-4 py-6 flex items-center gap-4 border-b border-[#3c4043]">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
          {business.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-medium">{business.name}</h1>
          <p className="text-xs text-[#9aa0a6]">Posting publicly across Google (Simulated)</p>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        
        {/* 5-Star Rating System */}
        <div className="flex gap-2 mb-2">
          {[...Array(5)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                  className="hidden"
                />
                <FaStar
                  className="cursor-pointer transition-colors duration-200"
                  size={42}
                  color={currentRating <= (hover || rating) ? "#fbbc04" : "#5f6368"}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
        <p className="text-[#fbbc04] font-medium h-6 mb-6">{getRatingText()}</p>

        {/* Text Area */}
        <div className="w-full bg-[#303134] rounded-xl p-4 mb-6 border border-[#5f6368] focus-within:border-blue-400 transition-colors">
          <textarea
            className="w-full bg-transparent outline-none resize-none text-[#e8eaed] placeholder-[#9aa0a6]"
            rows="4"
            placeholder="Share details of your own experience at this place"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          ></textarea>
        </div>

        {/* Action Buttons (Socials) */}
        <div className="flex flex-wrap justify-center gap-3 w-full mb-8">
          {business.whatsappNumber && (
            <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noreferrer" 
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043]">
              <FaWhatsapp color="#25D366" /> WhatsApp
            </a>
          )}
          {business.instagramHandle && (
            <a href={`https://instagram.com/${business.instagramHandle}`} target="_blank" rel="noreferrer"
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043]">
              <FaInstagram color="#E1306C" /> Instagram
            </a>
          )}
          {business.website && (
            <a href={business.website} target="_blank" rel="noreferrer"
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043]">
              <FaGlobe color="#8ab4f8" /> Website
            </a>
          )}
        </div>

        {/* Post Button */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#8ab4f8] text-[#202124] font-medium py-3 rounded-full hover:bg-[#aecbfa] transition-colors"
        >
          Post
        </button>

      </div>
    </div>
  );
};

export default CustomerReview;
