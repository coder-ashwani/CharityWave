import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-wave">🌊</span>
              <span className="logo-text">Charity<span className="logo-highlight">Wave</span></span>
            </div>
            <p className="footer-tagline">Making waves of change, one donation at a time. Connect with causes that matter and create lasting impact.</p>
            <div className="footer-socials">
              {/* <a href="#" className="social-link" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FiInstagram /></a> */}
              <a href="https://github.com/coder-ashwani" className="social-link" aria-label="GitHub"><FiGithub /></a>
              <a href="ashwaniwork27@gmail.com" className="social-link" aria-label="Email"><FiMail /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Platform</h4>
            <Link to="/campaigns" className="footer-link">Browse Campaigns</Link>
            <Link to="/categories" className="footer-link">Categories</Link>
            <Link to="/create-campaign" className="footer-link">Start a Campaign</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Categories</h4>
            <Link to="/campaigns" className="footer-link">📚 Education</Link>
            <Link to="/campaigns" className="footer-link">🏥 Healthcare</Link>
            <Link to="/campaigns" className="footer-link">⚽ Sports</Link>
            <Link to="/campaigns" className="footer-link">🌍 Environment</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <a href="#" className="footer-link">How it Works</a>
            <a href="#" className="footer-link">FAQs</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 CharityWave. Built with <FiHeart className="heart-icon" /> by Ashwani Agrawal</p>
        </div>
      </div>
    </footer>
  );
}
