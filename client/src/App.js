// client/src/App.js - FINAL, CORRECTED VERSION

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AboutPage from './pages/AboutPage';
import StoriesPage from './pages/StoriesPage';
import OurStoriesPage from './pages/OurStoriesPage';
import SharePage from './pages/SharePage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import Navbar from './components/Navbar';
import LeftMenu from './components/LeftMenu';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import DilemmaPage from './pages/DilemmaPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


// Import CSS
import './App.css';
import './layouts/MainLayout.css'; // We'll use the styles directly

// --- Placeholders ---
const TrendingPage = () => <div className="page-container"><h2>Trending: Page Coming Soon</h2></div>;

const TopPage = () => <div className="page-container"><h2>Top: Page Coming Soon</h2></div>;

const NewPage = () => <div className="page-container"><h2>New: Page Coming Soon</h2></div>;

// This is our new Layout Component. It defines the structure for all main pages.
const AppLayout = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const toggleMenu = () => { setIsMenuVisible(!isMenuVisible); };

  return (
    <>
      <Navbar onMenuToggle={toggleMenu} />
      <div className="main-layout-container">
        <div className={`sidebar-wrapper ${isMenuVisible ? 'visible' : 'hidden'}`}>
          <LeftMenu />
        </div>
        <main className="content-wrapper">
          {/* The Outlet tells the router where to render child routes */}
          <Outlet />
        </main>
      </div>
    </>
  );
};

// --- The Main App Component ---
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          {/* --- A SINGLE, UNIFIED ROUTING TABLE --- */}
          <Routes>
            {/* Group 1: All routes that use the main layout are nested here */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/top" element={<TopPage />} />
              <Route path="/new" element={<NewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/tags/:tagName" element={<TagPage />} />
              <Route path="/dilemma/:dilemmaId" element={<DilemmaPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/worlds" element={<StoriesPage />} />
              <Route path="/stories" element={<OurStoriesPage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/search" element={<SearchPage />} />
              {/* Add all other pages that need the sidebar/navbar here */}
            </Route>

            {/* Group 2: All standalone routes are here */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;