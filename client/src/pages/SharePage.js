// client/src/pages/SharePage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './SharePage.css'; 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
// --- The Form Component (for logged-in users) ---
const StoryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    categories: [],
    tags: '',
    isAnonymous: false,
  });
  const [error, setError] = useState('');

  const { title, story, categories, tags, isAnonymous } = formData;

  const availableWorlds = [
    "I Need Advice", "It's My Opinion", "Hypothetical", "Fiction",
    "Imaginary", "Change My Mind", "Dream Machine", "Writer's Block", "Why Do You Think?"
  ];

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, categories: [...categories, value] });
    } else {
      setFormData({ ...formData, categories: categories.filter(cat => cat !== value) });
    }
  };
  
  const onAnonymousChange = (e) => {
      setFormData({ ...formData, isAnonymous: e.target.checked });
  }

  const onSubmit = async e => {
    e.preventDefault();
    if(categories.length === 0) {
      setError('Please select at least one world for your story.');
      return;
    }
    setError('');
    
    // Convert comma-separated tags string into an array
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      const res = await axios.post('/api/dilemmas', { ...formData, tags: tagsArray });
      // Redirect to the new story page after successful submission
      navigate(`/dilemma/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form className="story-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" value={title} onChange={onChange} placeholder="Give your story a compelling title..." required />
      </div>
      <div className="form-group">
        <label htmlFor="story">Your Story</label>
        <textarea id="story" name="story" value={story} onChange={onChange} rows="10" placeholder="Let your thoughts flow. What's on your mind?" required></textarea>
      </div>
      <div className="form-group">
        <label>Choose Your World(s)</label>
        <div className="worlds-checkbox-container">
          {availableWorlds.map(world => (
            <label key={world} className="world-checkbox">
              <input type="checkbox" name="categories" value={world} checked={categories.includes(world)} onChange={onCategoryChange} />
              <span>{world}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input type="text" id="tags" name="tags" value={tags} onChange={onChange} placeholder="e.g. career, relationships, ethics" />
      </div>
      <div className="form-group-inline">
        <label htmlFor="isAnonymous" className="anonymous-checkbox">
            <input type="checkbox" id="isAnonymous" name="isAnonymous" checked={isAnonymous} onChange={onAnonymousChange} />
            Post Anonymously
        </label>
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="submit-story-btn">Publish Story</button>
    </form>
  );
};


// --- The Prompt Component (for logged-out users) ---
const SharePrompt = () => {
  return (
    <div className="share-prompt">
      <h2>Every perspective begins with a single story.</h2>
      <p>
        Your story could be the catalyst for a hundred different thoughts, a thousand different paths. To contribute to the collective and share your reality, you first need to join us.
      </p>
      <div className="prompt-actions">
        <Link to="/login" className="btn-prompt">Login</Link>
        <Link to="/register" className="btn-prompt primary">Create Your Account</Link>
      </div>
    </div>
  );
};


// --- The Main Page Component ---
const SharePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="share-page-container page-container">
      <header className="share-page-header">
        <h1>What's Your Story?</h1>
        <p className="subtitle">
          {isAuthenticated 
            ? "The floor is yours. Share your dilemma, dream, or idea with the collective."
            : "This is a sanctuary for thought. A place to ask, to wonder, and to explore."
          }
        </p>
      </header>

      <div className="content-area">
        {isAuthenticated ? <StoryForm /> : <SharePrompt />}
      </div>
    </div>
  );
};

export default SharePage;