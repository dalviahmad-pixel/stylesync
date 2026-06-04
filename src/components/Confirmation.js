import React from 'react';

function Confirmation({ onGoHome }) {
  return (
    <div className="card">
      <div className="confirmation-content">
        <span className="confirmation-emoji">✓</span>
        <h2 className="confirmation-heading">Your Weekly Outfits Are Ready!</h2>
        <p className="confirmation-text">
          We've curated personalized outfit suggestions based on your schedule and wardrobe.
        </p>
        <button className="btn-primary" onClick={onGoHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Confirmation;