// client/src/components/Navbar.js


import React, { useState } from 'react'; // 1. Import useState

import { NavLink, useNavigate } from 'react-router-dom'; // 2. Import useNavigate

import { Menu, Search, User, UserPlus, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext'; // 1. Import the useAuth hook
import './Navbar.css';

const Navbar = ({ onMenuToggle }) => {
  // 2. Get the authentication state and logout function from our global context
  const { isAuthenticated, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();



  // 4. Create a handler for when the search form is submitted

  const handleSearchSubmit = (e) => {

    e.preventDefault(); // Prevent page reload

    if (!searchQuery.trim()) return;

    

    // Navigate to the search results page with the query

    navigate(`/search?q=${searchQuery}`);

    setSearchQuery(''); // Optional: clear the search bar after submit

  };
  return (
    <header className="navbar-container">
      <div className="nav-container">
        <div className="nav-brand">
          <button className="menu-toggle-btn" onClick={onMenuToggle}>
            <Menu size={24} />
          </button>
          <NavLink to="/" className="nav-brand-link" end>
            <Logo />
            <span className="brand-name">ifiwereyou</span>
          </NavLink>
        </div>

        <div className="nav-center-block">
          <nav className="main-nav">
            <NavLink to="/about" className="nav-item">About</NavLink>
            <NavLink to="/stories" className="nav-item">Our Stories</NavLink>
          </nav>
          <div className="search-container">
              {/* Wrap input and button in a form */}
              <form onSubmit={handleSearchSubmit} className="search-form"> {/* Added className for potential styling */}
                  <input
                      type="text"
                      className="search-input"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {/* Add a submit button for accessibility and clarity */}
                  <button type="submit" className="search-button" aria-label="Search">
                      <Search size={20} /> {/* Add Search icon to the button */}
                  </button>
              </form>
          </div>
          <nav className="secondary-nav">
            <NavLink to="/share" className="nav-item">What's Your Story?</NavLink>
            <NavLink to="/worlds" className="nav-item">Worlds</NavLink>
          </nav>
        </div>

        {/* --- 3. THE CONDITIONAL LOGIC BLOCK --- */}
        <div className="navbar-right">
          {isAuthenticated ? (
            // If user IS logged in, show this:
            <div className="auth-links">
              <NavLink to="/profile" className="auth-link profile-link">
                <User size={16} />
                <span>Profile</span>
              </NavLink>
              <button onClick={logout} className="auth-link logout-button">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            // If user is NOT logged in, show this:
            <div className="auth-links">
              <NavLink to="/login" className="auth-link login-link">
                <User size={16} />
                <span>Login</span>
              </NavLink>
              <NavLink to="/register" className="auth-link signup-button">
                <UserPlus size={16} />
                <span>Sign Up</span>
              </NavLink>
            </div>
          )}
        </div>
        {/* --- END OF CONDITIONAL LOGIC --- */}
      </div>
    </header>
  );
};

export default Navbar;