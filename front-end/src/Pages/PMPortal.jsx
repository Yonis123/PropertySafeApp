import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PMPortal.css';
import pmpic from '../assets/png/pmpic.png';
const apiUrl = process.env.REACT_APP_API_URL



function PMPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('API URL:', apiUrl);
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        // Navigate to the Property Manager dashboard
        navigate('/PM-dashboard');
      } else {
        setError(data.error || 'Invalid login credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    // Reset the form fields after login attempt
    setEmail('');
    setPassword('');
  };

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  return (
    <div className="pm-portal-container">
      <div className="pm-portal-card">
        <div className="pm-image-section">
          <img src={pmpic} alt="Property Manager" className="pm-image" />
        </div>
        <h2 className="text-center mb-4">Property Manager Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4">
            Login
          </button>
        </form>
        <div className="create-account-section mt-4 text-center">
          <p>New here?</p>
          <button
            onClick={handleCreateAccount}
            className="btn btn-outline-primary"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default PMPortal;