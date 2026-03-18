import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight, FiHeart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Welcome to CharityWave! 🌊');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-bg">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
      </div>

      <div className="auth-card glass animate-fadeInUp">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="animate-wave">🌊</span>
            <span className="logo-text">Charity<span className="logo-highlight">Wave</span></span>
          </Link>
          <h1>Join the Wave</h1>
          <p>Create an account to start making a difference</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="reg-name"><FiUser /> Full Name</label>
            <input
              id="reg-name"
              type="text"
              className="input-field"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-email"><FiMail /> Email</label>
            <input
              id="reg-email"
              type="email"
              className="input-field"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-password"><FiLock /> Password</label>
            <input
              id="reg-password"
              type="password"
              className="input-field"
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>I want to</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${role === 'donor' ? 'active' : ''}`}
                onClick={() => setRole('donor')}
                id="role-donor"
              >
                <FiHeart /> Donate to Causes
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'requester' ? 'active' : ''}`}
                onClick={() => setRole('requester')}
                id="role-requester"
              >
                <FiUser /> Request Donations
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="register-submit-btn">
            {loading ? 'Creating Account...' : 'Create Account'} <FiArrowRight />
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
