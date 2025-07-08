// client/src/pages/CategoryPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DilemmaCard from '../components/DilemmaCard'; // 1. Import the new component
import './HomePage.css'; // Reuse the same page layout styles

const CategoryPage = () => {
  const [dilemmas, setDilemmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryName } = useParams();

  useEffect(() => {
    setLoading(true);
    const apiUrl = `/api/dilemmas?category=${encodeURIComponent(categoryName)}`;
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
  }, [categoryName]);

  return (
    <div className="page-content">
      <h1>{categoryName}</h1>
      
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
            <p className="empty-message">No dilemmas found in the "{categoryName}" category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;