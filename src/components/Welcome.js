import React, { useEffect } from 'react';

function Welcome({ userName, onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="card">
      <div className="welcome-screen-content">
        <span className="welcome-emoji">👋</span>
        <h2 className="welcome-heading">Welcome, {userName}!</h2>
        <p className="welcome-subtext">Let's build your wardrobe.</p>
      </div>
    </div>
  );
}

export default Welcome;