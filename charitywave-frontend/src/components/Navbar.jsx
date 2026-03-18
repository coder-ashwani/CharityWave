import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser, FiPlusCircle, FiHeart } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <span className="logo-wave">🌊</span>
          <span className="logo-text">Charity<span className="logo-highlight">Wave</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} id="nav-home">Home</Link>
          <Link to="/campaigns" className={`nav-link ${location.pathname === '/campaigns' ? 'active' : ''}`} id="nav-campaigns">Campaigns</Link>
          <Link to="/categories" className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`} id="nav-categories">Categories</Link>

          {isAuthenticated ? (
            <div className="nav-auth">
              <Link to="/create-campaign" className="btn btn-primary btn-sm" id="nav-create-campaign">
                <FiPlusCircle /> Start Campaign
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-sm" id="nav-dashboard">
                <FiUser /> {user?.name?.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-icon btn-sm" id="nav-logout" title="Logout">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                <FiHeart /> Join Now
              </Link>
            </div>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          id="navbar-toggle"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}
