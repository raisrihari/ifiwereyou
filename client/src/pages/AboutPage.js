// client/src/pages/AboutPage.js

import React from 'react';
import Logo from '../components/Logo'; // Re-use our logo for branding
import './AboutPage.css'; 

const AboutPage = () => {
  return (
    <div className="about-page-container page-container">
      <div className="manifesto-content">
        <div className="manifesto-logo">
          <Logo />
        </div>
        
        <p className="manifesto-intro">
          One thought is a line. Two thoughts are a conversation. A thousand thoughts are a universe.
        </p>
        
        <hr className="manifesto-divider" />
        
        <p>
          We live in a world of infinite, branching paths. Every choice we make, every doubt we entertain, every dream we chase creates a reality. But what about the realities we left behind? The doors we didn't open?
        </p>
        
        <p>
          <code>ifiwereyou</code> is not a place for answers. It is a place for echoes.
        </p>
        
        <p>
          It is an anonymous collective where you can safely place a piece of your reality—a decision, a creative block, a hypothetical crossroad, a half-remembered dream—into the center of the room. In return, the collective whispers back, not with what you <em>should</em> do, but with what <em>they</em> would do. Each perspective is a glimpse into a parallel life, a different choice made.
        </p>

        <p>
          Here, we don't solve problems. We illuminate them. We build a library of consciousness, one "what if" at a time. This is not social media. It is a tool for thought. A quiet space in the digital noise to untangle the complex, beautiful machinery of a single human moment.
        </p>

        <p className="manifesto-outro">
          Welcome to the conversation. See your life through other eyes.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;