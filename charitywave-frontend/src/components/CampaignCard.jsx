import { Link } from 'react-router-dom';
import { FiUsers, FiClock } from 'react-icons/fi';
import './CampaignCard.css';

export default function CampaignCard({ campaign }) {
  const formatAmount = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const daysLeft = () => {
    const end = new Date(campaign.endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <Link to={`/campaigns/${campaign.id}`} className="campaign-card card" id={`campaign-card-${campaign.id}`}>
      <div className="campaign-card-image">
        <img src={campaign.image} alt={campaign.title} loading="lazy" />
        <div className="campaign-card-badges">
          {campaign.urgent && <span className="badge badge-urgent">🔥 Urgent</span>}
          {campaign.featured && <span className="badge badge-featured">⭐ Featured</span>}
        </div>
        {campaign.category && (
          <span className="campaign-card-category" style={{ background: campaign.category.color + '22', color: campaign.category.color, borderColor: campaign.category.color + '44' }}>
            {campaign.category.icon} {campaign.category.name}
          </span>
        )}
      </div>

      <div className="campaign-card-body">
        <h3 className="campaign-card-title">{campaign.title}</h3>
        <p className="campaign-card-desc">{campaign.shortDescription}</p>

        <div className="campaign-card-progress">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${Math.min(campaign.progress, 100)}%` }}></div>
          </div>
          <div className="campaign-card-stats">
            <span className="stat-raised">{formatAmount(campaign.raisedAmount)} <span className="stat-label">raised</span></span>
            <span className="stat-goal">of {formatAmount(campaign.goalAmount)}</span>
          </div>
        </div>

        <div className="campaign-card-meta">
          <span className="meta-item"><FiUsers /> {campaign.donorsCount} donors</span>
          <span className="meta-item"><FiClock /> {daysLeft()} days left</span>
        </div>
      </div>
    </Link>
  );
}
