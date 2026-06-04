import React, { useState, useEffect } from 'react';

const API_BASE = '/_/backend';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const occasionOptions = ['Formal', 'Smart Casual', 'Casual', 'Sport'];

function EventCalendar({ onNext }) {
  const [events, setEvents] = useState([]);
  const [activeFormDay, setActiveFormDay] = useState(null);
  const [newEventName, setNewEventName] = useState('');
  const [newEventOccasion, setNewEventOccasion] = useState('Formal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadEvents() {
      try {
        const res = await fetch(`${API_BASE}/calendar`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to load calendar events');
        }

        const data = await res.json();
        // Map backend event_name to frontend name
        setEvents(data.map(e => ({ id: e.id, day: e.day, name: e.event_name, occasion: e.occasion })));
      } catch (err) {
        console.error('Failed to load calendar events:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const handleAddEvent = (day) => {
    setActiveFormDay(day);
    setNewEventName('');
    setNewEventOccasion('Formal');
  };

  const handleCancelEvent = () => {
    setActiveFormDay(null);
    setNewEventName('');
  };

  const handleSaveEvent = async () => {
    if (!newEventName.trim() || saving) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Not authenticated. Please log in.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/calendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          day: activeFormDay,
          event_name: newEventName,
          occasion: newEventOccasion,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save event');
      }

      const data = await res.json();
      const saved = data[0];
      // Map backend event_name to frontend name
      setEvents([...events, { id: saved.id, day: saved.day, name: saved.event_name, occasion: saved.occasion }]);
      setActiveFormDay(null);
      setNewEventName('');
    } catch (err) {
      console.error('Failed to save calendar event:', err);
      alert('Failed to save event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateOutfits = () => {
    if (onNext) {
      onNext();
    }
  };

  const getEventsForDay = (day) => {
    return events.filter(event => event.day === day);
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="section-heading">Your Week</h2>
        <p style={{ textAlign: 'center' }}>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-heading">Your Week</h2>
      
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="day-column">
            <div className="day-name">{day}</div>
            
            <div className="day-events">
              {getEventsForDay(day).map(event => (
                <div key={event.id} className="event-item">
                  <span className="event-name">{event.name}</span>
                  <span className="event-occasion">{event.occasion}</span>
                </div>
              ))}
            </div>

            {activeFormDay === day ? (
              <div className="event-form">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter event name"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                />
                
                <label className="form-label">Occasion</label>
                <select
                  className="form-input"
                  value={newEventOccasion}
                  onChange={(e) => setNewEventOccasion(e.target.value)}
                >
                  {occasionOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                
                <div className="event-form-buttons">
                  <button 
                    className="btn-primary btn-small"
                    onClick={handleSaveEvent}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="btn-secondary btn-small"
                    onClick={handleCancelEvent}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="add-event-btn"
                onClick={() => handleAddEvent(day)}
              >
                + Add Event
              </button>
            )}
          </div>
        ))}
      </div>

      <button 
        className="btn-primary"
        onClick={handleGenerateOutfits}
        style={{ marginTop: '24px' }}
      >
        Generate Outfits for This Week
      </button>

    </div>
  );
}

export default EventCalendar;