import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, business }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [step, setStep] = useState(1); // 1: Rating, 2: Feedback Form, 3: Success Message
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    
    // 4 ya 5 star: Redirect to real Google Review
    if (selectedRating >= 4) {
      window.location.href = business.googleReviewLink;
    } 
    // 1, 2, 3 star: Show internal feedback form
    else {
      setStep(2);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('https://my-qr-saas-backend.onrender.com/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business._id,
          rating: rating,
          message: feedback
        })
      });

      if (res.ok) {
        setStep(3); // Show success screen
      }
    } catch (error) {
      console.error("Error submitting feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="p-6 text-center">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Rate your visit</h2>
              <p className="text-gray-500 mb-6">How was your experience at {business.name}?</p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      size={40} 
                      className={`${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-2">How can we improve?</h2>
              <p className="text-sm text-gray-500 mb-4">We're sorry your experience wasn't perfect. Please let us know what went wrong.</p>
              
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full h-32 p-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-600 resize-none"
              ></textarea>
              
              <button 
                onClick={handleFeedbackSubmit}
                disabled={isSubmitting || !feedback.trim()}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-blue-300 hover:bg-blue-700 transition"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </>
          )}

          {step === 3 && (
            <div className="py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-green-500 fill-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-500">Your feedback helps us provide a better experience.</p>
              <button 
                onClick={onClose}
                className="mt-6 w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;