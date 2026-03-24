import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiUsers, FiTarget, FiTrendingUp, FiSearch } from 'react-icons/fi';
import api from '../api';
import CampaignCard from '../components/CampaignCard';
import LiveTicker from '../components/LiveTicker';
import './Home.css';

export default function Home() {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [urgentCampaigns, setUrgentCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, urgentRes, catRes, statsRes] = await Promise.all([
          api.get('/campaigns?featured=true'),
          api.get('/campaigns?urgent=true'),
          api.get('/categories'),
          api.get('/stats'),
        ]);
        setFeaturedCampaigns(featuredRes.data.slice(0, 4));
        setUrgentCampaigns(urgentRes.data.slice(0, 3));
        setCategories(catRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page" id="home-page">
      <LiveTicker />
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid-lines"></div>
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge animate-fadeInUp">
              <span className="animate-wave">🌊</span> Trusted by thousands of donors
            </div>
            <h1 className="hero-title animate-fadeInUp delay-1">
              Make <span className="gradient-text">Waves</span> of <br />
              <span className="gradient-text">Change</span> Today
            </h1>
            <p className="hero-subtitle animate-fadeInUp delay-2">
              CharityWave connects compassionate donors with individuals in need.
              Support causes in education, healthcare, sports, and more — because
              every wave starts with a single drop.
            </p>

            <div className="hero-actions animate-fadeInUp delay-3">
              <Link to="/campaigns" className="btn btn-primary btn-lg" id="hero-explore-btn">
                <FiSearch /> Explore Campaigns
              </Link>
              <Link to="/create-campaign" className="btn btn-secondary btn-lg" id="hero-start-btn">
                Start a Campaign <FiArrowRight />
              </Link>
            </div>

            {stats && (
              <div className="hero-stats animate-fadeInUp delay-4">
                <div className="hero-stat">
                  <span className="hero-stat-number">{formatAmount(stats.totalRaised)}</span>
                  <span className="hero-stat-label">Raised</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-number">{stats.totalCampaigns}</span>
                  <span className="hero-stat-label">Campaigns</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-number">{stats.totalDonors}+</span>
                  <span className="hero-stat-label">Donors</span>
                </div>
              </div>
            )}
          </div>

          <div className="hero-visual animate-fadeInUp delay-3">
            <div className="hero-card-stack">
              {urgentCampaigns.slice(0, 2).map((c, i) => (
                <div key={c.id} className={`hero-floating-card hero-fc-${i + 1}`}>
                  <img src={c.image} alt={c.title} />
                  <div className="hero-fc-info">
                    <span className="hero-fc-title">{c.title.substring(0, 40)}...</span>
                    <span className="hero-fc-amount">{formatAmount(c.raisedAmount)} raised</span>
                  </div>
                </div>
              ))}
              <div className="hero-impact-circle">
                <FiHeart className="hero-impact-icon" />
                <span className="hero-impact-text">{stats?.totalDonations}+ Lives Impacted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section" id="categories-section">
        <div className="container">
          <div className="section-header animate-fadeInUp">
            <span className="section-label">Explore Categories</span>
            <h2 className="section-title">Choose a Cause Close to Your <span className="gradient-text">Heart</span></h2>
            <p className="section-subtitle">Browse campaigns across various categories and support the causes that matter most to you.</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat, index) => (
              <Link
                to={`/campaigns?category=${cat.id}`}
                key={cat.id}
                className="category-card glass animate-fadeInUp"
                style={{ animationDelay: `${index * 0.08}s`, '--cat-color': cat.color }}
                id={`category-${cat.id}`}
              >
                <div className="category-icon-wrap" style={{ background: cat.color + '20' }}>
                  <span className="category-icon">{cat.icon}</span>
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-count">{cat.campaignCount} campaign{cat.campaignCount !== 1 ? 's' : ''}</p>
                <div className="category-glow" style={{ background: cat.color }}></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="section featured-section" id="featured-section">
        <div className="container">
          <div className="section-header animate-fadeInUp">
            <span className="section-label">Featured Campaigns</span>
            <h2 className="section-title">Campaigns Making <span className="gradient-text">Impact</span></h2>
            <p className="section-subtitle">These campaigns are creating real change. Join the movement.</p>
          </div>

          <div className="campaigns-grid">
            {featuredCampaigns.map((campaign, index) => (
              <div key={campaign.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>

          <div className="section-cta animate-fadeInUp">
            <Link to="/campaigns" className="btn btn-secondary btn-lg" id="view-all-campaigns-btn">
              View All Campaigns <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header animate-fadeInUp">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Three Steps to <span className="gradient-text">Making a Difference</span></h2>
          </div>

          <div className="steps-grid">
            <div className="step-card glass animate-fadeInUp delay-1">
              <div className="step-number">01</div>
              <div className="step-icon-wrap">
                <FiSearch className="step-icon" />
              </div>
              <h3 className="step-title">Discover Causes</h3>
              <p className="step-desc">Browse campaigns across education, healthcare, sports, environment and more. Find causes that resonate with you.</p>
            </div>

            <div className="step-connector animate-fadeInUp delay-2">
              <FiArrowRight />
            </div>

            <div className="step-card glass animate-fadeInUp delay-2">
              <div className="step-number">02</div>
              <div className="step-icon-wrap">
                <FiHeart className="step-icon" />
              </div>
              <h3 className="step-title">Make a Donation</h3>
              <p className="step-desc">Contribute any amount securely. Every donation, big or small, creates a ripple effect of positive change.</p>
            </div>

            <div className="step-connector animate-fadeInUp delay-3">
              <FiArrowRight />
            </div>

            <div className="step-card glass animate-fadeInUp delay-3">
              <div className="step-number">03</div>
              <div className="step-icon-wrap">
                <FiTrendingUp className="step-icon" />
              </div>
              <h3 className="step-title">Track Impact</h3>
              <p className="step-desc">Follow the campaigns you support and see the real-world impact your donations are making.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card glass animate-fadeInUp">
            <div className="cta-orb cta-orb-1"></div>
            <div className="cta-orb cta-orb-2"></div>
            <h2 className="cta-title">Ready to Make <span className="gradient-text">Waves</span>?</h2>
            <p className="cta-desc">Whether you want to donate or start a campaign, CharityWave makes it easy to create real change.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-join-btn">
                <FiHeart /> Join CharityWave
              </Link>
              <Link to="/campaigns" className="btn btn-secondary btn-lg" id="cta-explore-btn">
                Explore Campaigns <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
