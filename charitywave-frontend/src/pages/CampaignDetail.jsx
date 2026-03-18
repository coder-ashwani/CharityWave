import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiClock, FiShare2, FiArrowLeft, FiUser, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './CampaignDetail.css';

export default function CampaignDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.error('Failed to load campaign:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const formatAmount = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const daysLeft = () => {
    if (!campaign) return 0;
    const end = new Date(campaign.endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to donate');
      return;
    }
    if (!donationAmount || Number(donationAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setDonating(true);
    try {
      const res = await api.post('/donations', {
        campaignId: campaign.id,
        amount: Number(donationAmount),
        message: donationMessage,
        anonymous,
      });

      // Update campaign locally
      setCampaign(prev => ({
        ...prev,
        raisedAmount: prev.raisedAmount + Number(donationAmount),
        donorsCount: prev.donorsCount + 1,
        progress: Math.round(((prev.raisedAmount + Number(donationAmount)) / prev.goalAmount) * 100),
        donations: [res.data, ...(prev.donations || [])],
      }));

      toast.success(`Thank you for donating ${formatAmount(Number(donationAmount))}! 🎉`);
      setShowDonateModal(false);
      setDonationAmount('');
      setDonationMessage('');
      setAnonymous(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Donation failed. Please try again.');
    } finally {
      setDonating(false);
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  if (loading) {
    return (
      <div className="loading-container" style={{ paddingTop: '120px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2>Campaign not found</h2>
        <Link to="/campaigns" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Campaigns</Link>
      </div>
    );
  }

  return (
    <div className="campaign-detail-page" id="campaign-detail-page">
      <div className="container">
        <Link to="/campaigns" className="back-link animate-fadeInUp" id="back-to-campaigns">
          <FiArrowLeft /> Back to Campaigns
        </Link>

        <div className="campaign-detail-grid">
          {/* Left Column - Main Content */}
          <div className="campaign-detail-main animate-fadeInUp">
            <div className="campaign-detail-image">
              <img src={campaign.image} alt={campaign.title} />
              <div className="campaign-detail-badges">
                {campaign.urgent && <span className="badge badge-urgent">🔥 Urgent</span>}
                {campaign.featured && <span className="badge badge-featured">⭐ Featured</span>}
              </div>
            </div>

            <div className="campaign-detail-content">
              {campaign.category && (
                <span className="campaign-detail-category" style={{ background: campaign.category.color + '22', color: campaign.category.color, borderColor: campaign.category.color + '44' }}>
                  {campaign.category.icon} {campaign.category.name}
                </span>
              )}

              <h1 className="campaign-detail-title">{campaign.title}</h1>

              <div className="campaign-detail-author">
                <div className="author-avatar">
                  <FiUser />
                </div>
                <div>
                  <span className="author-name">{campaign.user?.name || 'Anonymous'}</span>
                  <span className="author-date"><FiCalendar /> Created {new Date(campaign.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="campaign-detail-description">
                <h2>About this Campaign</h2>
                <p>{campaign.description}</p>
              </div>

              {/* Donations List */}
              {campaign.donations && campaign.donations.length > 0 && (
                <div className="campaign-donations">
                  <h2>Recent Donations ({campaign.donations.length})</h2>
                  <div className="donations-list">
                    {campaign.donations.slice(0, 10).map(donation => (
                      <div key={donation.id} className="donation-item glass" id={`donation-${donation.id}`}>
                        <div className="donation-avatar">
                          <FiHeart />
                        </div>
                        <div className="donation-info">
                          <span className="donation-donor">{donation.donor?.name || 'Anonymous'}</span>
                          <span className="donation-amount">{formatAmount(donation.amount)}</span>
                          {donation.message && <p className="donation-message">"{donation.message}"</p>}
                        </div>
                        <span className="donation-time">{new Date(donation.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="campaign-detail-sidebar animate-fadeInUp delay-2">
            <div className="sidebar-card glass">
              <div className="sidebar-progress">
                <div className="sidebar-amounts">
                  <span className="sidebar-raised">{formatAmount(campaign.raisedAmount)}</span>
                  <span className="sidebar-goal">raised of {formatAmount(campaign.goalAmount)} goal</span>
                </div>
                <div className="progress-bar" style={{ height: '12px' }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.min(campaign.progress, 100)}%` }}></div>
                </div>
                <span className="sidebar-percent">{campaign.progress}% funded</span>
              </div>

              <div className="sidebar-stats">
                <div className="sidebar-stat">
                  <FiUsers className="sidebar-stat-icon" />
                  <div>
                    <span className="sidebar-stat-value">{campaign.donorsCount}</span>
                    <span className="sidebar-stat-label">Donors</span>
                  </div>
                </div>
                <div className="sidebar-stat">
                  <FiClock className="sidebar-stat-icon" />
                  <div>
                    <span className="sidebar-stat-value">{daysLeft()}</span>
                    <span className="sidebar-stat-label">Days Left</span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg donate-btn"
                onClick={() => setShowDonateModal(true)}
                id="donate-btn"
              >
                <FiHeart /> Donate Now
              </button>

              <button className="btn btn-secondary share-btn" id="share-btn">
                <FiShare2 /> Share Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setShowDonateModal(false)}>
          <div className="modal-content glass animate-fadeInUp" onClick={e => e.stopPropagation()} id="donate-modal">
            <button className="modal-close" onClick={() => setShowDonateModal(false)}>
              <FiArrowLeft /> Back
            </button>

            <div className="modal-header">
              <span className="modal-icon animate-wave">💝</span>
              <h2>Make a Donation</h2>
              <p className="modal-subtitle">Supporting: {campaign.title}</p>
            </div>

            <form onSubmit={handleDonate} className="donate-form">
              <div className="quick-amounts">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={`quick-amount-btn ${donationAmount === String(amount) ? 'active' : ''}`}
                    onClick={() => setDonationAmount(String(amount))}
                  >
                    {formatAmount(amount)}
                  </button>
                ))}
              </div>

              <div className="input-group">
                <label>Custom Amount (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={e => setDonationAmount(e.target.value)}
                  min="1"
                  id="donation-amount-input"
                />
              </div>

              <div className="input-group">
                <label>Message (optional)</label>
                <textarea
                  className="input-field"
                  placeholder="Write an encouraging message..."
                  value={donationMessage}
                  onChange={e => setDonationMessage(e.target.value)}
                  rows="3"
                  id="donation-message-input"
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)}
                  id="anonymous-checkbox"
                />
                <span className="checkbox-custom"></span>
                Donate anonymously
              </label>

              {!isAuthenticated && (
                <div className="login-notice">
                  <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to complete your donation.</p>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-success btn-lg"
                style={{ width: '100%' }}
                disabled={donating || !isAuthenticated}
                id="confirm-donate-btn"
              >
                {donating ? 'Processing...' : `Donate ${donationAmount ? formatAmount(Number(donationAmount)) : ''}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
