import React, { useState } from 'react';

const clothingItems = [
  { id: 1, name: 'White Button Shirt', category: 'Tops', style: 'Smart Casual', emoji: '👔' },
  { id: 2, name: 'Navy Blazer', category: 'Tops', style: 'Formal', emoji: '🧥' },
  { id: 3, name: 'Black Jeans', category: 'Bottoms', style: 'Casual', emoji: '👖' },
  { id: 4, name: 'White Sneakers', category: 'Shoes', style: 'Casual', emoji: '👟' },
  { id: 5, name: 'Grey Dress Pants', category: 'Bottoms', style: 'Formal', emoji: '👖' },
  { id: 6, name: 'Blue Oxford Shirt', category: 'Tops', style: 'Smart Casual', emoji: '👔' }
];

const filterOptions = ['All', 'Tops', 'Bottoms', 'Shoes', 'Formal', 'Casual'];

function MyWardrobe({ onNext }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredItems = clothingItems.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Tops' || activeFilter === 'Bottoms' || activeFilter === 'Shoes') {
      return item.category === activeFilter;
    }
    if (activeFilter === 'Formal' || activeFilter === 'Casual') {
      return item.style === activeFilter;
    }
    return true;
  });

  return (
    <div className="card">
      <div className="upload-box">
        <span className="upload-icon">📷</span>
        <p className="upload-text">Tap to photograph or upload a clothing item</p>
      </div>

      <div className="filter-bar">
        {filterOptions.map(filter => (
          <button
            key={filter}
            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <h2 className="section-heading">Your Wardrobe</h2>
      
      <div className="wardrobe-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="clothing-card">
            <span className="clothing-emoji">{item.emoji}</span>
            <p className="clothing-name">{item.name}</p>
            <span className="clothing-tag">{item.style}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onNext}>Next</button>
    </div>
  );
}

export default MyWardrobe;