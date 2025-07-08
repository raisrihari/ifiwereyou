// client/src/layouts/MainLayout.js

import React from 'react';
import LeftMenu from '../components/LeftMenu';
import './MainLayout.css';

// It receives the visibility state and the 'children' (the nested Routes)
const MainLayout = ({ isMenuVisible, children }) => {
  return (
    <div className="main-layout-container">
      <div className={`sidebar-wrapper ${isMenuVisible ? 'visible' : 'hidden'}`}>
        <LeftMenu />
      </div>
      <main className="content-wrapper">
        {children} {/* This renders the nested Routes from App.js */}
      </main>
    </div>
  );
};

export default MainLayout;