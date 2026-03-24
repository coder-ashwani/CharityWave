import { useState, useEffect } from 'react';
import { FiZap, FiHeart } from 'react-icons/fi';
import api from '../api';
import './LiveTicker.css';

export default function LiveTicker() {
  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRecent = async () => {
      // Only fetch if the tab is actually visible to save API quota
      if (document.visibilityState !== 'visible') return;
      
      try {
        const res = await api.get('/donations/recent');
        if (res.data.length > 0) {
          setActivities(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch recent activity:', err);
      }
    };

    fetchRecent();
    const interval = setInterval(fetchRecent, 300000); // Poll every 5 minutes
    
    // Also listen for visibility changes to refresh immediately when user comes back
    document.addEventListener('visibilitychange', fetchRecent);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', fetchRecent);
    };
  }, []);

  useEffect(() => {
    if (activities.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
      }, 5000); // Rotate every 5 seconds
      return () => clearInterval(timer);
    }
  }, [activities]);

  if (activities.length === 0) return null;

  const current = activities[currentIndex];

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return 'today';
  };

  return (
    <div className="live-ticker-bar">
      <div className="container">
        <div className="ticker-content">
          <div className="ticker-badge">
            <FiZap className="zap-icon" /> LIVE ACTIVITY
          </div>
          <div className="ticker-message animate-slideUpDown" key={current.id}>
            <span className="ticker-user">{current.donorName}</span>
            <span className="ticker-action">donated </span>
            <span className="ticker-amount">₹{current.amount.toLocaleString()}</span>
            <span className="ticker-action"> to </span>
            <span className="ticker-campaign">"{current.campaignTitle}"</span>
            <span className="ticker-time">{timeAgo(current.createdAt)}</span>
          </div>
          <div className="ticker-heart">
            <FiHeart />
          </div>
        </div>
      </div>
    </div>
  );
}
