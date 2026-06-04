import React, { useState } from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const occasionOptions = ['Formal', 'Smart Casual', 'Casual', 'Sport'];

const initialEvents = [
  { id: 1, day: 'Monday', name: 'Team Standup', occasion: 'Smart Casual' },
  { id: 2, day: 'Wednesday', name: 'Client Presentation', occasion: 'Formal' },
  { id: 3, day: 'Friday', name: 'Gym Session', occasion: 'Sport' }
];

function EventCalendar({ onNext }) {
  const [events, setEvents] = useState(initialEvents);
  const [activeFormDay, setActiveFormDay] = useState(null);
  const [newEventName, setNewEventName] = useState('');
  const [newEventOccasion, setNewEventOccasion] = useState('Formal');

  const handleAddEvent = (day) => {
    setActiveFormDay(day);
    setNewEventName('');
    setNewEventOccasion('Formal');
  };

  const handleCancelEvent = () => {
    setActiveFormDay(null);
    setNewEventName('');
  };

  const handleSaveEvent = () => {
    if (newEventName.trim()) {
      const newEvent = {
        id: Date.now(),
        day: activeFormDay,
        name: newEventName,
        occasion: newEventOccasion
      };
      setEvents([...events, newEvent]);
      setActiveFormDay(null);
      setNewEventName('');
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
                  >
                    Save
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