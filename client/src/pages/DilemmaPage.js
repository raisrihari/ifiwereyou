// client/src/pages/DilemmaPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Star, Award, Edit, Trash2 } from 'lucide-react';
import './DilemmaPage.css';
axios.defaults.baseURL = 'https://ifiwereyou.onrender.com'; 
const DilemmaPage = () => {
    // --- STATE AND HOOKS ---
    const [dilemma, setDilemma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newPerspective, setNewPerspective] = useState('');

    const [editingPerspective, setEditingPerspective] = useState(null);
    const [editedText, setEditedText] = useState('');

    const [editingDilemma, setEditingDilemma] = useState(false);
    const [editedDilemmaTitle, setEditedDilemmaTitle] = useState('');
    const [editedDilemmaStory, setEditedDilemmaStory] = useState('');
    const [editedDilemmaTags, setEditedDilemmaTags] = useState('');
    const [editedDilemmaCategories, setEditedDilemmaCategories] = useState('');

    const [confirmingDelete, setConfirmingDelete] = useState(null);

    const { dilemmaId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // --- DATA FETCHING ---
    const fetchDilemma = useCallback(async () => {
        try {
            const response = await axios.get(`/api/dilemmas/${dilemmaId}`);
            setDilemma(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching dilemma:", err);
            if (err.response && err.response.status === 404) {
                navigate('/not-found');
            } else {
                setError('Failed to load dilemma. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }, [dilemmaId, navigate]);

    useEffect(() => {
        fetchDilemma();
    }, [fetchDilemma]);

    // --- DILEMMA-SPECIFIC ACTION HANDLERS ---
    const handleStartEditDilemma = () => {
        setEditingDilemma(true);
        if (dilemma) {
            setEditedDilemmaTitle(dilemma.title);
            setEditedDilemmaStory(dilemma.story);
            setEditedDilemmaTags(dilemma.tags ? dilemma.tags.join(', ') : '');
            setEditedDilemmaCategories(dilemma.categories ? dilemma.categories.join(', ') : '');
        }
    };

    const handleEditDilemmaSubmit = async (e) => {
        e.preventDefault();
        if (!editedDilemmaTitle.trim() || !editedDilemmaStory.trim() || !editedDilemmaCategories.trim()) {
            alert('Title, Story, and Categories cannot be empty.');
            return;
        }
        try {
            const tagsArray = editedDilemmaTags.split(',').map(tag => tag.trim()).filter(tag => tag);
            const categoriesArray = editedDilemmaCategories.split(',').map(cat => cat.trim()).filter(cat => cat);

            const updatedDilemmaData = {
                title: editedDilemmaTitle,
                story: editedDilemmaStory,
                tags: tagsArray,
                categories: categoriesArray,
            };

            await axios.put(`/api/dilemmas/${dilemmaId}`, updatedDilemmaData);
            
            setEditingDilemma(false);
            fetchDilemma();
        } catch (err) {
            console.error("Failed to edit dilemma:", err);
            setError("Failed to edit dilemma. Please try again.");
        }
    };

    const handleDeleteDilemma = async () => {
        try {
            await axios.delete(`/api/dilemmas/${dilemmaId}`);
            navigate('/');
        } catch (err) {
            console.error("Failed to delete dilemma", err);
            setError("Failed to delete dilemma. Please try again.");
        }
    };

    // --- PERSPECTIVE-SPECIFIC ACTION HANDLERS ---
    const handlePerspectiveSubmit = async (e) => {
        e.preventDefault();
        if (!newPerspective.trim()) {
            alert('Perspective text cannot be empty.');
            return;
        }
        try {
            await axios.post(`/api/perspectives/${dilemmaId}`, { text: newPerspective });
            setNewPerspective('');
            fetchDilemma();
        } catch (err) {
            console.error("Failed to post perspective", err);
            setError("Failed to post perspective. Please try again.");
        }
    };

    const handleStartEdit = (perspectiveToEdit) => {
        setEditingPerspective(perspectiveToEdit);
        setEditedText(perspectiveToEdit.text);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        if (!editedText.trim()) {
            alert('Edited perspective text cannot be empty.');
            return;
        }
        if (!editingPerspective) {
            console.error("No perspective selected for editing.");
            return;
        }

        try {
            await axios.put(`/api/perspectives/${editingPerspective._id}`, { text: editedText });
            
            setEditingPerspective(null);
            setEditedText('');
            
            fetchDilemma();
        } catch (err) {
            console.error("Failed to edit perspective", err);
            setError("Failed to edit perspective. Please try again.");
        }
    };

    const handleDeletePerspective = async (perspectiveId) => {
        try {
            await axios.delete(`/api/perspectives/${perspectiveId}`);
            fetchDilemma();
        } catch (err) {
            console.error("Failed to delete perspective", err);
            setError("Failed to delete perspective. Please try again.");
        }
    };

    // --- COMBINED DELETE LOGIC (for both dilemma and perspective) ---
    const handleConfirmDelete = (type, id) => {
        setConfirmingDelete({ type, id });
    };

    const executeDelete = async () => {
        if (!confirmingDelete) return;

        try {
            if (confirmingDelete.type === 'dilemma') {
                await handleDeleteDilemma();
            } else if (confirmingDelete.type === 'perspective') {
                await handleDeletePerspective(confirmingDelete.id);
            }
        } catch (error) {
            console.error("Error during delete execution:", error);
        } finally {
            setConfirmingDelete(null);
        }
    };

    const handleMarkBestClick = async (perspectiveId) => {
        try {
            await axios.put(`/api/perspectives/best/${perspectiveId}`);
            fetchDilemma();
        } catch (err) {
            console.error("Failed to mark as best", err);
            setError("Failed to mark as best. Please try again.");
        }
    };

    const handleInterestingClick = async () => {
        if (!isAuthenticated) return alert('Please log in to interact.');
        try {
            await axios.put(`/api/dilemmas/interesting/${dilemmaId}`);
            fetchDilemma();
        } catch (err) {
            console.error("Failed to mark as interesting", err);
            setError("Failed to mark as interesting. Please try again.");
        }
    };

    const handleStarClick = async (perspectiveId) => {
        if (!isAuthenticated) return alert('Please log in to interact.');
        try {
            await axios.put(`/api/perspectives/star/${perspectiveId}`);
            fetchDilemma();
        } catch (err) {
            console.error("Failed to star perspective", err);
            setError("Failed to star perspective. Please try again.");
        }
    };

    // Helper to check if user has starred a perspective
    const hasUserStarred = (p) => {
        return isAuthenticated && user && p.starredBy && p.starredBy.includes(user._id);
    };

    // Conditional rendering for loading, error, and dilemma not found
    if (loading) return <div className="page-container"><h2>Loading...</h2></div>;
    if (error) return <div className="page-container"><h2>Error: {error}</h2></div>;
    if (!dilemma) return <div className="page-container"><h2>Story not found.</h2></div>;

    const isDilemmaAuthor = isAuthenticated && user && user._id === dilemma.author._id;
    const hasUserMarkedInteresting = isAuthenticated && user && dilemma.interestedBy && dilemma.interestedBy.includes(user._id);
    const interestingCount = dilemma.interestedBy ? dilemma.interestedBy.length : 0;

    return (
        <div className="dilemma-page-layout">
            <article className="dilemma-content">
                <header className="dilemma-header">
                    {isDilemmaAuthor && (
                        <div className="content-actions">
                            {editingDilemma ? (
                                <button onClick={() => setEditingDilemma(false)} className="action-btn cancel-btn">
                                    Cancel Edit
                                </button>
                            ) : (
                                <button onClick={handleStartEditDilemma} className="action-btn edit-btn">
                                    <Edit size={16}/> Edit Story
                                </button>
                            )}
                            <button onClick={() => handleConfirmDelete('dilemma', dilemma._id)} className="action-btn delete-btn">
                                <Trash2 size={16}/> Delete Story
                            </button>
                        </div>
                    )}
                    {editingDilemma ? (
                        <form onSubmit={handleEditDilemmaSubmit} className="dilemma-edit-form">
                            <input
                                type="text"
                                value={editedDilemmaTitle}
                                onChange={(e) => setEditedDilemmaTitle(e.target.value)}
                                placeholder="Dilemma Title"
                                className="edit-title-input"
                            />
                            <textarea
                                value={editedDilemmaStory}
                                onChange={(e) => setEditedDilemmaStory(e.target.value)}
                                placeholder="Dilemma Story"
                                className="edit-story-textarea"
                                rows="10"
                            ></textarea>
                            <input
                                type="text"
                                value={editedDilemmaCategories}
                                onChange={(e) => setEditedDilemmaCategories(e.target.value)}
                                placeholder="Categories (comma-separated)"
                                className="edit-categories-input"
                            />
                            <input
                                type="text"
                                value={editedDilemmaTags}
                                onChange={(e) => setEditedDilemmaTags(e.target.value)}
                                placeholder="Tags (comma-separated)"
                                className="edit-tags-input"
                            />
                            <div className="dilemma-edit-actions">
                                <button type="submit" className="btn-save">Save Changes</button>
                                <button type="button" onClick={() => setEditingDilemma(false)} className="btn-cancel">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1>{dilemma.title} {dilemma.isEdited && <em className="edited-marker">(edited)</em>}</h1>
                             <div className="metadata">
                                <span>Posted by: {dilemma.isAnonymous ? 'Anonymous' : (dilemma.author ? <span className="plain-author-name">{dilemma.author.username}</span> : '')}</span>
                                <span className="separator">|</span>
                                <span>{new Date(dilemma.createdAt).toLocaleDateString()}</span>
                            </div>
                            <section className="story-body">
                                {dilemma.story.split('\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </section>
                        </>
                    )}
                </header>
                
            </article>

            <aside className="dilemma-sidebar">
                <div className="sidebar-box">
                    <h3 className="sidebar-title">Worlds</h3>
                    <div className="categories-container">
                        {dilemma.categories.map(category => (
                            <Link key={category} to={`/category/${category}`} className="category-tag">
                                <span>{category}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="sidebar-box">
                    <h3 className="sidebar-title">Tags</h3>
                    <div className="tags-container">
                        {dilemma.tags.map(tag => (
                            <Link key={tag} to={`/tags/${tag}`} className="tag">
                                <span>#{tag}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* INTERACTIONS BOX */}
                <div className="sidebar-box">
                    <h3 className="sidebar-title">Interactions</h3>
                    <button
                        className={`interaction-btn glow-on-hover ${hasUserMarkedInteresting ? 'marked-interesting' : ''}`}
                        onClick={handleInterestingClick}
                        disabled={!isAuthenticated}
                    >
                        {hasUserMarkedInteresting ? 'Marked as Interesting' : 'This is Interesting'} ({interestingCount})
                    </button>
                </div>
            </aside>

            <section className="perspectives-section">
                <h2 className="perspectives-title">Perspectives ({dilemma.perspectives ? dilemma.perspectives.length : 0})</h2>

                {isAuthenticated ? (
                    <form className="perspective-form" onSubmit={handlePerspectiveSubmit}>
                        <textarea
                            placeholder="Share your perspective... If you were them, what would you do?"
                            value={newPerspective}
                            onChange={(e) => setNewPerspective(e.target.value)}
                        ></textarea>
                        <button type="submit" className="animated-line-box submit-btn">
                            <svg viewBox="0 0 180 60" preserveAspectRatio="none"><rect x="0" y="0" width="180" height="60"/></svg>
                            <span>Submit Perspective</span>
                        </button>
                    </form>
                ) : (
                    <div className="login-prompt">
                        <p><Link to="/login">Login</Link> or <Link to="/register">Sign Up</Link> to share your perspective.</p>
                    </div>
                )}

                <div className="perspectives-list">
                    {dilemma.perspectives && dilemma.perspectives.length > 0 ? (
                        dilemma.perspectives.map(p => {
                            const isPerspectiveAuthor = isAuthenticated && user && user._id === p.author._id;
                            const isEditingThis = editingPerspective && editingPerspective._id === p._id;
                            const hasUserStarredPerspective = isAuthenticated && user && p.starredBy && p.starredBy.includes(user._id);

                            return (
                                <div key={p._id} className={`perspective-card ${p.isMarkedBest ? 'best-perspective' : ''} ${isEditingThis ? 'is-editing' : ''}`}>
                                    
                                    {isEditingThis ? (
                                        <form onSubmit={handleEditSubmit} className="edit-form">
                                            <textarea 
                                                value={editedText} 
                                                onChange={(e) => setEditedText(e.target.value)} 
                                                autoFocus
                                                className="edit-textarea"
                                            ></textarea>
                                            <div className="edit-form-actions">
                                                <button type="button" onClick={() => setEditingPerspective(null)} className="btn-cancel">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn-save">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p className="perspective-text">
                                            {p.text} 
                                            {p.isEdited && <em className="edited-marker">(edited)</em>}
                                        </p>
                                    )}

                                    {!isEditingThis && (
                                        <div className="perspective-footer">
                                            <span className="author-name">
                                                by {p.isAnonymous ? 'Anonymous' : (p.author ? <span className="plain-author-name">{p.author.username}</span> : '...')}
                                            </span>
                                            <div className="perspective-actions">
                                                {isPerspectiveAuthor && (
                                                    <>
                                                        <button onClick={() => handleStartEdit(p)} className="action-btn edit-btn" title="Edit Perspective">
                                                            <Edit size={16}/>
                                                        </button>
                                                        <button onClick={() => handleConfirmDelete('perspective', p._id)} className="action-btn delete-btn" title="Delete Perspective">
                                                            <Trash2 size={16}/>
                                                        </button>
                                                    </>
                                                )}
                                                {isDilemmaAuthor && ( // "Mark as Best" only for dilemma author
                                                    <button onClick={() => handleMarkBestClick(p._id)} className={`action-btn best-btn ${p.isMarkedBest ? 'active' : ''}`} title="Mark as Best">
                                                        {/* MODIFIED: Award icon fill & stroke */}
                                                        <Award 
                                                            size={16} 
                                                            fill={p.isMarkedBest ? '#A9B1B8' : 'none'} // Silver color for active
                                                            stroke={p.isMarkedBest ? '#A9B1B8' : 'currentColor'} // Match stroke to fill or default
                                                        />
                                                    </button>
                                                )}
                                                {isAuthenticated && ( // Star button for any logged-in user
                                                    <button onClick={() => handleStarClick(p._id)} className={`action-btn star-btn ${hasUserStarredPerspective ? 'active' : ''}`} title="Star this perspective">
                                                        {/* MODIFIED: Star icon fill & stroke */}
                                                        <Star 
                                                            size={16} 
                                                            fill={hasUserStarredPerspective ? '#FFD700' : 'none'} // Gold color for active
                                                            stroke={hasUserStarredPerspective ? '#FFD700' : 'currentColor'} // Match stroke to fill or default
                                                        />
                                                        <span>{p.starredBy ? p.starredBy.length : 0}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <p className="empty-message">Be the first to share your perspective.</p>
                    )}
                </div>

            </section>
            
            {confirmingDelete && (
                <div className="confirm-delete-modal-backdrop">
                    <div className="confirm-delete-modal">
                        <h3>Are you sure?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={() => setConfirmingDelete(null)} className="btn-cancel">Cancel</button>
                            <button onClick={executeDelete} className="btn-delete-confirm">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DilemmaPage;