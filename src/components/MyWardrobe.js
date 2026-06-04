import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const seedItems = [
  { name: 'White Button Shirt', category: 'Tops', style: 'Smart Casual', emoji: '👔' },
  { name: 'Navy Blazer', category: 'Tops', style: 'Formal', emoji: '🧥' },
  { name: 'Black Jeans', category: 'Bottoms', style: 'Casual', emoji: '👖' },
  { name: 'White Sneakers', category: 'Shoes', style: 'Casual', emoji: '👟' },
  { name: 'Grey Dress Pants', category: 'Bottoms', style: 'Formal', emoji: '👖' },
  { name: 'Blue Oxford Shirt', category: 'Tops', style: 'Smart Casual', emoji: '👔' },
];

const filterOptions = ['All', 'Tops', 'Bottoms', 'Shoes', 'Formal', 'Casual'];

function MyWardrobe({ onNext }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    const authHeader = { Authorization: `Bearer ${token}` };

    async function loadWardrobe() {
      try {
        // Fetch existing items
        const res = await fetch(`${API_BASE}/wardrobe`, {
          headers: authHeader,
        });

        if (!res.ok) {
          throw new Error('Failed to load wardrobe');
        }

        let items = await res.json();

        // If no items yet, seed the default wardrobe
        if (items.length === 0) {
          for (const item of seedItems) {
            const seedRes = await fetch(`${API_BASE}/wardrobe`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...authHeader,
              },
              body: JSON.stringify(item),
            });

            if (!seedRes.ok) {
              console.error('Failed to seed item:', item.name);
            }
          }

          // Re-fetch after seeding
          const refreshRes = await fetch(`${API_BASE}/wardrobe`, {
            headers: authHeader,
          });

          if (refreshRes.ok) {
            items = await refreshRes.json();
          }
        }

        setClothingItems(items);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load wardrobe');
      } finally {
        setLoading(false);
      }
    }

    loadWardrobe();
  }, []);

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

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading wardrobe...</p>
      ) : (
        <div className="wardrobe-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="clothing-card">
              <span className="clothing-emoji">{item.emoji}</span>
              <p className="clothing-name">{item.name}</p>
              <span className="clothing-tag">{item.style}</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn-primary" onClick={onNext}>Next</button>
    </div>
  );
}

export default MyWardrobe;