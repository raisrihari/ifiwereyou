// client/src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Camera } from 'lucide-react';
import DilemmaCard from '../components/DilemmaCard'; // Re-use our card component!
import './ProfilePage.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
const ProfilePage = () => {
    // Get the full user object, loading state, and the loadUser function from context
    const { user, loading, loadUser } = useAuth();
    
    // State for this page
    const [dilemmas, setDilemmas] = useState([]);
    const [file, setFile] = useState(null); // The actual file object for upload
    const [preview, setPreview] = useState(''); // A temporary URL for image preview
    const [uploading, setUploading] = useState(false); // To show a loading state on the button
    const [error, setError] = useState(''); // For upload errors

    useEffect(() => {
        const fetchUserDilemmas = async () => {
            // Only fetch if we have a user and their ID
            if (user && user._id) {
                try {
                    const res = await axios.get(`/api/dilemmas/by-author/${user._id}`);
                    setDilemmas(res.data);
                } catch (err) {
                    console.error("Could not fetch user's dilemmas", err);
                }
            }
        };
        fetchUserDilemmas();
    }, [user]); // Re-run this effect whenever the user object changes

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Create a temporary local URL for preview
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true); // Set loading state
        setError('');

        const formData = new FormData();
        formData.append('profilePicture', file); // The key 'profilePicture' must match the back-end

        try {
            await axios.post('/api/users/upload-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Crucially, call loadUser() to refresh the global user state
            // This will update the user.profilePictureUrl everywhere in the app
            await loadUser(); 
            
            // Reset the form
            setPreview('');
            setFile(null);
        } catch (err) {
            console.error('Upload failed', err.response?.data?.msg || err.message);
            setError(err.response?.data?.msg || 'Upload failed. Please try another image.');
        } finally {
            setUploading(false); // Reset loading state
        }
    };

    if (loading || !user) {
        return <div className="page-container"><h2>Loading Profile...</h2></div>;
    }

    return (
        <div className="profile-page-container page-container">
            <header className="profile-header">
                <div className="profile-picture-wrapper">
                    {/* Show preview if it exists, otherwise show the user's saved pic, or a default */}
                    <img src={preview || user.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="Profile" className="profile-picture" />
                    <label htmlFor="pictureUpload" className="picture-upload-label" title="Change profile picture">
                        <Camera size={20} />
                    </label>
                    <input id="pictureUpload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                </div>
                <div className="profile-info">
                    <h2>{user.username}</h2>
                    <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p>Email: {user.email}</p>
                </div>
            </header>
            
            {/* This form only appears after a new file is selected */}
            {preview && (
                <form className="upload-form" onSubmit={handleUpload}>
                    <p>New profile picture selected.</p>
                    {error && <p className="error-text">{error}</p>}
                    <div className="upload-actions">
                        <button type="button" onClick={() => { setFile(null); setPreview(''); }} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload & Save'}
                        </button>
                    </div>
                </form>
            )}

            <section className="profile-content">
                <h3>My Stories ({dilemmas.length})</h3>
                <div className="user-dilemmas-list">
                    {dilemmas.length > 0 ? (
                        dilemmas.map(dilemma => (
                            <DilemmaCard key={dilemma._id} dilemma={dilemma} />
                        ))
                    ) : (
                        <p>You haven't posted any stories yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;