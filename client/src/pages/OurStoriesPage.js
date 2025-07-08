// client/src/pages/OurStoriesPage.js

import React from 'react';
import './OurStoriesPage.css'; // We'll create this for our new styles

// A reusable component for a profile card
const ProfileCard = ({ name, role, bio, imageUrl }) => (
  <div className="profile-card">
    <div className="profile-image-container">
      <img src={imageUrl} alt={`Profile of ${name}`} className="profile-image" />
    </div>
    <h3 className="profile-name">{name}</h3>
    <h4 className="profile-role">{role}</h4>
    <p className="profile-bio">{bio}</p>
  </div>
);


const OurStoriesPage = () => {
  return (
    <div className="our-stories-container page-container">
      <header className="our-stories-header">
        <h1>The Story of a Question</h1>
        <p className="subtitle">Every great project begins not with an answer, but with a question. Ours was simple: <em>"What if?"</em></p>
      </header>

      <section className="narrative-section">
        <p>
          <strong>`ifiwereyou` was born from a conversation.</strong> A late-night discussion about the choices that define us, the paths not taken, and the universal human experience of standing at a crossroads. We realized that the most valuable advice doesn't come from a single expert, but from the symphony of a hundred different perspectives.
        </p>
        <p>
          We were tired of the noise of social media—the judgment, the performance, the endless stream of curated perfection. We wanted to build the opposite: an anonymous sanctuary for the messy, uncertain, and beautifully complex parts of being human. A place to ask for help without fear, to explore an idea without commitment, and to dream without limits.
        </p>
        <p>
          This platform is a testament to the power of empathy. It's an experiment in collective consciousness, built by a small team who believe that seeing the world through another's eyes is the fastest way to understand our own.
        </p>
      </section>

      <div className="team-divider">
        <span>Meet The Architects</span>
      </div>

      <section className="team-section">
        <ProfileCard 
          name="Srihari Rai"
          role="Founder, Visionary, Developer & System Architect"
          bio="Srihari is the founder, visionary, developer, and system architect behind ifiwereyou. With a passion for building meaningful digital spaces, he combines technical expertise with a deep curiosity about human nature. Srihari believes in the transformative power of empathy and strives to create platforms that foster genuine connection and understanding. "
          imageUrl="/0_-1JZmBvx3DZxBR1o.jpg" // Placeholder image
        />
      </section>
    </div>
  );
};

export default OurStoriesPage;