// client/src/components/Logo.js - YOUR LOGO

import React from 'react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" className="logo">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFFF" />
        <stop offset="50%" stopColor="#FF00FF" />
        <stop offset="100%" stopColor="#FFFF00" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="12" r="6" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
    <path d="M10 18 Q16 24 22 18" stroke="url(#logoGradient)" strokeWidth="2" fill="none"/>
    <path d="M13 21 Q16 23 19 21" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none"/>
    <circle cx="14" cy="10" r="1.5" fill="url(#logoGradient)"/>
    <circle cx="18" cy="10" r="1.5" fill="url(#logoGradient)"/>
  </svg>
);

export default Logo;