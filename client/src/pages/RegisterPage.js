// client/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AuthPage.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
const RegisterPage = () => {
  // We no longer need the error from useAuth, we'll handle our own.
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  // --- NEW: A single state object for all field errors ---
  const [errors, setErrors] = useState({});

  const { username, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error for a field as soon as the user starts typing in it again
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    // --- Front-end validation ---
    const newErrors = {};
    if (username.length < 3) newErrors.username = 'Username must be at least 3 characters.';
    if (!/^[a-zA-Z0-9]+$/.test(username)) newErrors.username = 'Username can only contain letters and numbers.';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) newErrors.password = 'Password must include letters and numbers.';
    if (password !== password2) newErrors.password2 = 'Passwords do not match.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the submission if there are front-end errors
    }

    // --- Back-end API call ---
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify({ username, email, password });
      
      await axios.post('/api/users/register', body, config);
      
      // If registration is successful, log the new user in immediately
      await login(email, password);
      // The login function already handles the redirect, so we don't need to do it here.

    } catch (err) {
      const apiError = err.response?.data?.msg || 'An unknown error occurred.';
      const newApiErrors = {};

      // --- NEW: Map API errors to specific fields ---
      if (apiError.toLowerCase().includes('email')) {
        newApiErrors.email = apiError;
      } else if (apiError.toLowerCase().includes('username')) {
        newApiErrors.username = apiError;
      } else {
        // Generic error if it doesn't match a field
        newApiErrors.general = apiError;
      }
      setErrors(newApiErrors);
    }
  };

  return (
    <div className="auth-page-container" style={{ minHeight: '90vh' }}>
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/"><Logo /></Link>
          <h2>Create Your Account</h2>
          <p>Join the collective. Start sharing your perspective.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {/* Display a general error if we have one */}
          {errors.general && <p className="error-text api-error">{errors.general}</p>}

          <div className="input-group">
            <User className="input-icon" size={20} />
            <input type="text" name="username" className={errors.username ? 'has-error' : ''} placeholder="Username" value={username} onChange={onChange} required />
            {/* Display the username error right below its field */}
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" name="email" className={errors.email ? 'has-error' : ''} placeholder="Email" value={email} onChange={onChange} required />
            {/* Display the email error right below its field */}
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type={showPassword ? 'text' : 'password'} name="password" className={errors.password ? 'has-error' : ''} placeholder="Password" value={password} onChange={onChange} required />
            <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {/* Display the password error right below its field */}
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type={showPassword ? 'text' : 'password'} name="password2" className={errors.password2 ? 'has-error' : ''} placeholder="Confirm Password" value={password2} onChange={onChange} required />
            {/* Display the confirm password error right below its field */}
            {errors.password2 && <p className="error-text">{errors.password2}</p>}
          </div>
          
          <button type="submit" className="auth-submit-btn">
            <span>Sign Up</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;