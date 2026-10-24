import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaGlobe, FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';

const CustomerReview = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [step, setStep] = useState("sentiment"); 
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  // Dynamic Points States
  const [displayPoints, setDisplayPoints] = useState(0);
  const [displayRatings, setDisplayRatings] = useState(0);
  const [displayAnswers, setDisplayAnswers] = useState(0);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`https://my-qr-saas-backend.onrender.com/api/business/${slug}`);
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

  // Points Animation Trigger
  useEffect(() => {
    if (step === "submitted") {
      // Check karein ki user ne text box me kuch likha hai ya nahi
      const hasText = feedbackText.trim().length > 0;
      const targetTotal = hasText ? 4 : 1;
      const targetAnswers = hasText ? 3 : 0;

      let count = 0;
      
      // Speed fast karne ke liye 250ms se 80ms kar diya hai
      const interval = setInterval(() => {
        count++;
        setDisplayPoints(count);
        setDisplayRatings(Math.min(count, 1)); // Rating ka hamesha 1 point
        
        if (count > 1) {
          setDisplayAnswers(Math.min(count - 1, targetAnswers));
        }

        if (count >= targetTotal) clearInterval(interval);
      }, 80); 

      return () => clearInterval(interval);
    }
  }, [step, feedbackText]);

  const handleGoodExperience = () => {
    if (business.googleReviewLink) {
      window.location.href = business.googleReviewLink;
    } else {
      alert("Google Review link is not set for this business.");
    }
  };

  const submitBadExperience = async () => {
    if (rating === 0) return alert("Please give a star rating first!");

    try {
      const response = await fetch(`https://my-qr-saas-backend.onrender.com/api/business/${slug}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedbackText }) 
      });

      if (response.ok) {
        setStep("submitted");
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      alert("Server connection error.");
    }
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
      
      {/* Header */}
      <div className="w-full max-w-md px-4 py-6 flex items-center gap-4 border-b border-[#3c4043]">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
          {business.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-medium">{business.name}</h1>
          <p className="text-xs text-[#9aa0a6]">Posting publicly across Google (Simulated)</p>
        </div>
      </div>

      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        
        {/* Step 1: Sentiment Gateway */}
        {step === "sentiment" && (
          <div className="w-full flex flex-col items-center fade-in">
            <h2 className="text-xl font-semibold mb-8 text-center">How was your experience today?</h2>
            
            <div className="flex gap-6 mb-10 w-full justify-center">
              <button onClick={handleGoodExperience} className="flex flex-col items-center justify-center gap-3 w-32 h-32 bg-[#303134] border border-[#5f6368] rounded-2xl hover:bg-[#3c4043] transition-colors">
                <FaThumbsUp size={40} color="#25D366" />
                <span className="text-sm font-medium">Great</span>
              </button>

              <button onClick={() => setStep("feedback")} className="flex flex-col items-center justify-center gap-3 w-32 h-32 bg-[#303134] border border-[#5f6368] rounded-2xl hover:bg-[#3c4043] transition-colors">
                <FaThumbsDown size={40} color="#ea4335" />
                <span className="text-sm font-medium">Needs Work</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full border-t border-[#3c4043] pt-8">
              {business.whatsappNumber && (
                <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043]">
                  <FaWhatsapp color="#25D366" /> WhatsApp
                </a>
              )}
              {business.instagramHandle && (
                <a href={`https://instagram.com/${business.instagramHandle}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043]">
                  <FaInstagram color="#E1306C" /> Instagram
                </a>
              )}
              {business.website && (
                <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043]">
                  <FaGlobe color="#8ab4f8" /> Website
                </a>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Fake Google Review Form */}
        {step === "feedback" && (
          <div className="w-full flex flex-col items-center fade-in">
            <div className="flex gap-2 mb-2">
              {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;
                return (
                  <label key={index}>
                    <input type="radio" name="rating" value={currentRating} onClick={() => setRating(currentRating)} className="hidden" />
                    <FaStar className="cursor-pointer transition-colors duration-200" size={42} color={currentRating <= (hover || rating) ? "#fbbc04" : "#5f6368"} onMouseEnter={() => setHover(currentRating)} onMouseLeave={() => setHover(0)} />
                  </label>
                );
              })}
            </div>
            <p className="text-[#fbbc04] font-medium h-6 mb-6">{getRatingText()}</p>

            <div className="w-full bg-[#303134] rounded-xl p-4 mb-6 border border-[#5f6368] focus-within:border-blue-400 transition-colors">
              <textarea className="w-full bg-transparent outline-none resize-none text-[#e8eaed] placeholder-[#9aa0a6]" rows="4" placeholder="Share details of your own experience at this place" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}></textarea>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={() => setStep("sentiment")} className="flex-1 bg-transparent border border-[#5f6368] text-[#8ab4f8] py-3 rounded-full hover:bg-[#303134] transition-colors">Cancel</button>
              <button onClick={submitBadExperience} className="flex-1 bg-[#8ab4f8] text-[#202124] font-medium py-3 rounded-full hover:bg-[#aecbfa] transition-colors">Post</button>
            </div>
          </div>
        )}

        {/* Step 3: Animated Google Thanks Screen */}
        {step === "submitted" && (
          <div className="w-full max-w-sm flex flex-col items-center relative overflow-hidden bg-[#202124] rounded-3xl p-6 shadow-2xl">
            
            {/* CSS Animations injected for the shapes */}
            <style>
              {`
                @keyframes floatPop {
                  0% { transform: scale(0) rotate(0deg); opacity: 0; }
                  20% { transform: scale(1.1) rotate(10deg); opacity: 1; }
                  100% { transform: scale(1) rotate(5deg) translateY(-10px); opacity: 0.9; }
                }
                @keyframes floatSlow {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-15px) rotate(15deg); }
                }
                @keyframes floatReverse {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(15px) rotate(-15deg); }
                }
                .shape-1 { animation: floatPop 0.6s ease-out forwards, floatSlow 4s ease-in-out 0.6s infinite; }
                .shape-2 { animation: floatPop 0.8s ease-out forwards, floatReverse 5s ease-in-out 0.8s infinite; }
                .shape-3 { animation: floatPop 0.5s ease-out forwards, floatSlow 4.5s ease-in-out 0.5s infinite; }
                .shape-4 { animation: floatPop 0.7s ease-out forwards, floatReverse 4s ease-in-out 0.7s infinite; }
                .shape-5 { animation: floatPop 0.9s ease-out forwards, floatSlow 5.5s ease-in-out 0.9s infinite; }
              `}
            </style>

            {/* Floating Shapes */}
            <div className="shape-1 absolute -top-4 -left-4 w-16 h-8 bg-[#3ea6ff] rounded-full opacity-0 origin-center"></div>
            <div className="shape-2 absolute top-4 -right-6 w-20 h-10 bg-[#fbbc04] rounded-full opacity-0 origin-center"></div>
            <div className="shape-3 absolute -bottom-6 left-10 w-16 h-16 bg-[#fbbc04] rounded-tl-full opacity-0 origin-center"></div>
            <div className="shape-4 absolute -bottom-2 -right-2 w-16 h-12 bg-[#3ea6ff] rounded-tl-full opacity-0 origin-center"></div>
            <div className="shape-5 absolute top-1/3 -left-4 w-8 h-8 bg-[#34a853] rounded-full opacity-0 origin-center"></div>

            {/* Profile Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden mt-6 z-10 border border-[#5f6368]">
              <img src="https://ui-avatars.com/api/?name=User&background=5f6368&color=fff" alt="User" className="w-full h-full object-cover" />
            </div>

            {/* Dynamic Points & Title */}
            <h2 className="text-4xl font-normal text-[#e8eaed] mt-4 z-10">+{displayPoints} points</h2>
            <p className="text-[#9aa0a6] text-sm mt-2 z-10">You've earned points for helping others</p>
            
            <button className="text-[#8ab4f8] text-sm font-medium mt-4 z-10 hover:underline">
              See your reviews
            </button>

            {/* Points Breakdown */}
            <div className="w-full mt-8 z-10 px-2">
              <div className="flex justify-between items-center py-3 border-b border-[#3c4043] transition-all duration-300">
                <div className="flex items-center gap-4 text-[#e8eaed]">
                  <FaStar className="text-[#9aa0a6]" size={18} />
                  <span className="text-[15px]">Ratings</span>
                </div>
                <span className="text-[15px] text-[#9aa0a6]">+{displayRatings}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3c4043] transition-all duration-300">
                <div className="flex items-center gap-4 text-[#e8eaed]">
                  <svg className="w-[18px] h-[18px] text-[#9aa0a6] fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>
                  <span className="text-[15px]">Answers</span>
                </div>
                <span className="text-[15px] text-[#9aa0a6]">+{displayAnswers}</span>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-3 w-full mt-10 z-10 justify-end">
              <button onClick={() => setStep("sentiment")} className="px-5 py-2.5 rounded-full border border-[#5f6368] text-[#8ab4f8] text-sm font-medium hover:bg-[#303134] transition-colors">
                Contribute more
              </button>
              <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-full bg-[#a8c7fa] text-[#062e6f] text-sm font-medium hover:bg-[#d3e3fd] transition-colors">
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerReview;