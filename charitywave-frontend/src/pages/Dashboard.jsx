import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiHeart, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('campaigns'); // campaigns or donations
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [campRes, donRes] = await Promise.all([
          api.get('/campaigns'),
          api.get('/donations/my')
        ]);
        const userCampaigns = campRes.data.filter(c => c.user?.id === user?.id);
        setMyCampaigns(userCampaigns);
        setMyDonations(donRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, user?.id]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.delete(`/campaigns/${id}`);
      setMyCampaigns(prev => prev.filter(c => c.id !== id));
      toast.success('Campaign deleted successfully');
    } catch (err) {
      toast.error('Failed to delete campaign');
    }
  };

  const formatAmount = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const renderContent = () => {
    if (loading) {
      return <div className="loading-container"><div className="spinner"></div></div>;
    }

    if (activeTab === 'campaigns') {
      if (myCampaigns.length === 0) {
        return (
          <div className="dashboard-empty animate-fadeInUp">
            <FiActivity className="empty-icon" />
            <h3>No campaigns yet</h3>
            <p>Start a campaign to start making a difference.</p>
            <Link to="/create-campaign" className="btn btn-primary">Create Campaign</Link>
          </div>
        );
      }

      return (
        <div className="dashboard-grid animate-fadeInUp">
          {myCampaigns.map(campaign => (
            <div key={campaign.id} className="dashboard-card glass">
              <div className="dash-card-image">
                <img src={campaign.image} alt={campaign.title} />
                <span className={`dash-status status-${campaign.status}`}>{campaign.status}</span>
              </div>
              <div className="dash-card-content">
                <Link to={`/campaigns/${campaign.id}`} className="dash-card-title">{campaign.title}</Link>
                <div className="dash-progress">
                  <div className="dash-progress-stats">
                    <span className="dash-raised">{formatAmount(campaign.raisedAmount)}</span>
                    <span className="dash-goal">of {formatAmount(campaign.goalAmount)}</span>
                  </div>
                  <div className="progress-bar" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${Math.min(campaign.progress, 100)}%` }}></div>
                  </div>
                </div>
                <div className="dash-actions">
                  <Link to={`/campaigns/${campaign.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>View</Link>
                  <button onClick={() => handleDelete(campaign.id)} className="btn btn-secondary btn-sm btn-icon" style={{ borderColor: 'var(--cw-error)', color: 'var(--cw-error)' }}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Donations Tab
    if (myDonations.length === 0) {
      return (
        <div className="dashboard-empty animate-fadeInUp">
          <FiHeart className="empty-icon" />
          <h3>No donations yet</h3>
          <p>Find a cause you care about and make your first donation.</p>
          <Link to="/campaigns" className="btn btn-primary">Browse Campaigns</Link>
        </div>
      );
    }

    return (
      <div className="donations-list animate-fadeInUp">
        {myDonations.map(donation => (
          <div key={donation.id} className="donation-history-item glass">
            {donation.campaign?.image && (
              <img src={donation.campaign.image} alt={donation.campaign.title} className="dh-image" />
            )}
            <div className="dh-content">
              <Link to={`/campaigns/${donation.campaignId}`} className="dh-title">
                {donation.campaign?.title || 'Unknown Campaign'}
              </Link>
              <span className="dh-date">{new Date(donation.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              {donation.message && <p className="dh-message">"{donation.message}"</p>}
            </div>
            <div className="dh-amount">
              {formatAmount(donation.amount)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="container">
        <div className="dashboard-header animate-fadeInUp">
          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="dashboard-greeting">Hello, {user?.name}</h1>
              <p className="dashboard-role badge" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '8px' }}>
                {user?.role === 'requester' ? 'Campaign Creator' : 'Donor'}
              </p>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="glass stat-box">
              <div className="stat-icon-wrap"><FiTrendingUp /></div>
              <div>
                <span className="stat-label">My Campaigns</span>
                <span className="stat-value">{myCampaigns.length}</span>
              </div>
            </div>
            <div className="glass stat-box">
              <div className="stat-icon-wrap" style={{ color: 'var(--cw-error)' }}><FiHeart /></div>
              <div>
                <span className="stat-label">My Donations</span>
                <span className="stat-value">{myDonations.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs animate-fadeInUp delay-1">
          <button
            className={`dash-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            My Campaigns
          </button>
          <button
            className={`dash-tab ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Donation History
          </button>
        </div>

        <div className="dashboard-content animate-fadeInUp delay-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
