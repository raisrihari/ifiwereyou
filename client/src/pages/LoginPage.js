// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import './AuthPage.css';

const LoginPage = () => {
  const { login, error } = useAuth(); // 2. Get the login function and error state from context
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    // 3. Call the login function with the form data
    login(email, password); 
  };

  return (
    <div className="auth-page-container" style={{ minHeight: '90vh' }}>
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/"><Logo /></Link>
          <h2>Welcome Back</h2>
          <p>Enter the threshold. New perspectives await.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {/* Display API errors here */}
          {error && <p className="error-text">{error}</p>}

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" name="email" placeholder="Email" value={email} onChange={onChange} required />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type="password" name="password" placeholder="Password" value={password} onChange={onChange} required />
          </div>
          <button type="submit" className="auth-submit-btn">
            <span>Login</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;