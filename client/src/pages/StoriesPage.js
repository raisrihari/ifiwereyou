// client/src/pages/StoriesPage.js

import React, { useState, useEffect } from 'react';
import DilemmaCard from '../components/DilemmaCard'; // Re-use our beautiful card component
import './StoriesPage.css'; 

const StoriesPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'crossroads', 'sandbox', 'engine'
  const [dilemmas, setDilemmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'all', name: 'All Stories' },
    { id: 'crossroads', name: 'The Crossroads' },
    { id: 'sandbox', name: 'The Sandbox' },
    { id: 'engine', name: 'The Engine Room' },
  ];

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      
      let apiUrl = '/api/dilemmas';
       if (activeTab !== 'all') {
        apiUrl += `?world=${activeTab}`;
      }

      if (activeTab === 'crossroads') apiUrl = '/api/dilemmas?category=I Need Advice';
      if (activeTab === 'sandbox') apiUrl = '/api/dilemmas?category=Hypothetical';
      if (activeTab === 'engine') apiUrl = '/api/dilemmas?category=Dream Machine';


      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch stories.');
        const data = await response.json();
        setDilemmas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [activeTab]); // Re-fetch whenever the activeTab changes

  return (
    <div className="stories-page-container page-container">
      <header className="stories-page-header">
        <h1>The Archive</h1>
        <p>Browse the complete collection of stories, thoughts, and dreams.</p>
      </header>

      <div className="tabs-container">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="stories-grid">
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">Error: {error}</div>}

        {!loading && !error && dilemmas.length > 0 ? (
          dilemmas.map(dilemma => (
            <DilemmaCard key={dilemma._id} dilemma={dilemma} />
          ))
        ) : (
          !loading && <p className="empty-message">No stories found in this section.</p>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;