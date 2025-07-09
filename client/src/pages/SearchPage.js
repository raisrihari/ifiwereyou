// client/src/pages/SearchPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DilemmaCard from '../components/DilemmaCard';
import './HomePage.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
const SearchPage = () => {
    const [dilemmas, setDilemmas] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // useSearchParams is the modern hook for reading URL query parameters
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Get the value of 'q'

    useEffect(() => {
        if (!query) {
            setDilemmas([]);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/dilemmas/search?q=${query}`);
                setDilemmas(res.data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]); // Re-run the search every time the 'q' parameter changes

    return (
        <div className="page-content">
            <h1>Search Results for: "{query}"</h1>
            
            {loading && <div className="loading-message">Searching...</div>}

            {!loading && (
                <div className="dilemma-list">
                    {dilemmas.length > 0 ? (
                        dilemmas.map(dilemma => (
                            <DilemmaCard key={dilemma._id} dilemma={dilemma} />
                        ))
                    ) : (
                        <p className="empty-message">No stories found matching your search.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;