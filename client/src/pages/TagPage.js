// client/src/pages/TagPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DilemmaCard from '../components/DilemmaCard'; // Re-use our awesome card
import './HomePage.css'; // Reuse the same page layout styles

const TagPage = () => {
  const [dilemmas, setDilemmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This hook reads the part of the URL after "/tags/"
  const { tagName } = useParams();

  // This effect will re-run every time the tagName in the URL changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Construct the API URL with the tag as a query parameter
    const apiUrl = `/api/dilemmas?tag=${encodeURIComponent(tagName)}`;

    const fetchDilemmas = async () => {
      try {
        const response = await fetch(apiUrl);
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
  }, [tagName]);

  return (
    <div className="page-content">
      {/* Use the tag name from the URL as the dynamic page title */}
      <h1>#{tagName}</h1>
      
      {loading && <div className="loading-message">Loading Stories...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && (
        <div className="dilemma-list">
          {dilemmas.length > 0 ? (
            dilemmas.map((dilemma) => (
              <DilemmaCard key={dilemma._id} dilemma={dilemma} />
            ))
          ) : (
            <p className="empty-message">No dilemmas found with the tag "{tagName}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TagPage;