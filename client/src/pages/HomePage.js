// client/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import DilemmaCard from '../components/DilemmaCard'; // 1. Import the new component
import './HomePage.css'; // We'll keep this for page-specific layout

const HomePage = () => {
  const [dilemmas, setDilemmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDilemmas = async () => {
      try {
        const response = await fetch('/api/dilemmas');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setDilemmas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDilemmas();
  }, []);
  
  return (
    <div className="page-content">
      <h1>The Crossroads</h1>
      
      {loading && <div className="loading-message">Loading Stories...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && (
        <div className="dilemma-list">
          {dilemmas.length > 0 ? (
            // 2. Simply map and render the DilemmaCard component
            dilemmas.map((dilemma) => (
              <DilemmaCard key={dilemma._id} dilemma={dilemma} />
            ))
          ) : (
            <p className="empty-message">No dilemmas have been posted yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;