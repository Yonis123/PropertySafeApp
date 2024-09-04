import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './CreateAccount.css';
import pmpic from '../assets/png/pmpic.png';

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();  // Initialize useNavigate

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError('');
        // Redirect to login page after successful account creation
        navigate('/pm-portal');  // Redirect to the login page
      } else {
        setError(data.error || "An error occurred");
        setSuccess('');
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <div className="account-image-section">
          <img src={pmpic} alt="Property Manager" className="account-image"/>
        </div>
        <h2 className="text-center mb-4">Create Your Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleCreateAccount}>
          <div className="form-group mt-3">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
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
          <div className="form-group mt-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success btn-block mt-4">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;