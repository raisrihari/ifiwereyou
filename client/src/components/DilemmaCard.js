// client/src/components/DilemmaCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './DilemmaCard.css';

const DilemmaCard = ({ dilemma }) => {
    return (
        <Link to={`/dilemma/${dilemma._id}`} className="dilemma-card-link">
            <div className="dilemma-card">
                <div className="card-header">
                    <Link to={`/dilemma/${dilemma._id}`} className="card-title-link">
                        <h2>{dilemma.title}</h2>
                    </Link>
                    <div className="card-tags">
                        {dilemma.tags && dilemma.tags.map(tag => (
                            <Link key={tag} to={`/tags/${tag}`} className="tag-link">
                                <span>#{tag}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <p className="story-snippet">
                    {dilemma.story.substring(0, 250)}...
                </p>
                
                <div className="card-footer">
                    <span>{dilemma.perspectives ? dilemma.perspectives.length : 0} Perspectives</span>
                    {/* FIX : Changed dilemma.interesting to dilemma.interestedBy */}
                    <span>{dilemma.interestedBy ? dilemma.interestedBy.length : 0} Interesting</span>
                    <span className="author-name">
                        {dilemma.isAnonymous 
                            ? 'by Anonymous' 
                            : (dilemma.author ? `by ${dilemma.author.username}` : '')
                        }
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default DilemmaCard;