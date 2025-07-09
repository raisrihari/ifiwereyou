// client/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = 'https://ifiwereyou.onrender.com'; 
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      try {
        const res = await axios.get('/api/users/me');
        setUser(res.data);
      } catch (err) {
        logout(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login Failed');
      logout(false);
    }
  };

  // --- NEW: THE REGISTER FUNCTION ---
  const register = async ({ username, email, password }) => {
    setError(null);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ username, email, password });

    try {
      // Call the register endpoint
      const res = await axios.post('/api/users/register', body, config);
      
      // The API returns a token upon successful registration
      // Now we do the same thing as the login function
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      
      // Load the new user's data
      await loadUser();

      // Redirect to the homepage
      navigate('/');

    } catch (err) {
      // Set the error message from the API (e.g., "User already exists")
      setError(err.response?.data?.msg || 'Registration Failed');
      logout(false); // Clear any lingering state
    }
  };


  const logout = (shouldRedirect = true) => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    if (shouldRedirect) navigate('/');
  };

  // Add the new register function to the context value
  const value = { token, user, isAuthenticated: !!user, loading, error, login, logout, loadUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
