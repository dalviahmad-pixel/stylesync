import React, { useState } from 'react';

function SignUp({ onNext, onUserDataChange, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (name && email && password) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: name }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Sign up failed');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        onUserDataChange({ name, email, password });
        onNext();
      } catch (err) {
        setError(err.message || 'Sign up failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card">
      <p className="welcome-text">Your AI stylist is ready. Let's build your wardrobe.</p>

      {error && <p className="error-text" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing up...' : 'Next'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateToLogin}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Log In
        </button>
      </p>
    </div>
  );
}

export default SignUp;