import React from 'react';

const outfitSuggestions = [
  {
    id: 1,
    occasion: 'Board Meeting, Formal',
    items: [
      { name: 'Navy Blazer', emoji: '🧥' },
      { name: 'White Button Shirt', emoji: '👔' },
      { name: 'Grey Dress Pants', emoji: '👖' }
    ]
  },
  {
    id: 2,
    occasion: 'Coffee Date, Smart Casual',
    items: [
      { name: 'Blue Oxford Shirt', emoji: '👕' },
      { name: 'Black Jeans', emoji: '👖' },
      { name: 'White Sneakers', emoji: '👟' }
    ]
  },
  {
    id: 3,
    occasion: 'Weekend Outing, Casual',
    items: [
      { name: 'White Button Shirt', emoji: '👔' },
      { name: 'Black Jeans', emoji: '👖' },
      { name: 'White Sneakers', emoji: '👟' }
    ]
  }
];

function OutfitSuggestions({ onNext }) {
  const handleWearThis = (outfitId) => {
    alert(`You selected outfit ${outfitId}! This would be saved to your calendar.`);
  };

  const handleRegenerate = (outfitId) => {
    alert(`Regenerating outfit suggestion ${outfitId}...`);
  };

  return (
    <div className="card">
      <h2 className="section-heading">Your Outfits for Today</h2>
      
      {outfitSuggestions.map(outfit => (
        <div key={outfit.id} className="outfit-card">
          <p className="outfit-occasion">{outfit.occasion}</p>
          
          <div className="outfit-items">
            {outfit.items.map((item, index) => (
              <div key={index} className="outfit-item">
                <span className="outfit-item-emoji">{item.emoji}</span>
                <span className="outfit-item-name">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="outfit-buttons">
            <button 
              className="btn-primary btn-small"
              onClick={() => handleWearThis(outfit.id)}
            >
              Wear This
            </button>
            <button 
              className="btn-secondary btn-small"
              onClick={() => handleRegenerate(outfit.id)}
            >
              Regenerate
            </button>
          </div>
        </div>
      ))}

      <button className="btn-primary" onClick={onNext}>Next</button>
    </div>
  );
}

export default OutfitSuggestions;