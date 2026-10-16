import React from 'react';
import { Link } from 'react-router-dom';

const About = () => (
  <main className="about-page">
    <div className="about-container">
      <header className="about-header">
        <span className="about-label">Open Research Hub · NEOLAiA</span>
        <h1>About the Open Research Hub</h1>
        <p>Service information</p>
      </header>

      <section className="about-section">
        <h2>Service description</h2>
        <p>
          The NEOLAiA Open Research Hub is an online networking platform for researchers
          from the alliance’s nine partner universities. It brings researcher profiles
          and areas of expertise together in one searchable place, making it easier to
          find colleagues with shared interests and start conversations across
          disciplines and borders.
        </p>
      </section>

      <section className="about-section">
        <h2>Who the service is for</h2>
        <p>
          Researchers from NEOLAiA partner universities can voluntarily add their
          profiles. Researchers inside and outside the alliance can browse the hub to
          discover expertise and potential collaborators.
        </p>
      </section>

      <section className="about-section">
        <h2>Using the hub</h2>
        <ul className="about-list">
          <li>Search profiles by university, research area and other areas of expertise.</li>
          <li>Explore shared interests and find people for future research collaborations.</li>
          <li>Share your own expertise by creating a researcher profile.</li>
        </ul>
        <div className="about-links">
          <Link to="/search-researchers">Explore researchers</Link>
          <Link to="/participate">Create your profile</Link>
        </div>
      </section>

      <section className="about-section">
        <h2>Support</h2>
        <p>If you need help with the Open Research Hub, contact the support team:</p>
        <a className="about-email" href="mailto:openresearchhub-neolaia-support-list@unisa.it">
          openresearchhub-neolaia-support-list@unisa.it
        </a>
      </section>

      <section className="about-section">
        <h2>Privacy and profile information</h2>
        <p>
          Profile information is openly accessible under the CC BY-SA licence.
          Information about the processing of personal data is available in the
          privacy policy.
        </p>
        <Link className="about-privacy-link" to="/privacy_policy">View privacy policy</Link>
      </section>

      <footer className="about-footer">
        <Link to="/">← Back to the Open Research Hub</Link>
      </footer>
    </div>
  </main>
);

export default About;
