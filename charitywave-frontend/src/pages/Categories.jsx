import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container" style={{ paddingTop: '120px' }}><div className="spinner"></div></div>;
  }

  return (
    <div className="categories-page" id="categories-page">
      <div className="categories-page-hero">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="container">
          <h1 className="categories-page-title animate-fadeInUp">
            Browse by <span className="gradient-text">Category</span>
          </h1>
          <p className="categories-page-subtitle animate-fadeInUp delay-1">
            Find campaigns organized by the causes you care about most.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="categories-page-grid">
          {categories.map((cat, index) => (
            <Link
              to={`/campaigns?category=${cat.id}`}
              key={cat.id}
              className="category-page-card glass animate-fadeInUp"
              style={{ animationDelay: `${index * 0.08}s`, '--cat-color': cat.color }}
              id={`cat-page-${cat.id}`}
            >
              <div className="cat-page-header">
                <div className="cat-page-icon-wrap" style={{ background: cat.color + '20' }}>
                  <span className="cat-page-icon">{cat.icon}</span>
                </div>
                <div className="cat-page-badge" style={{ background: cat.color + '22', color: cat.color }}>
                  {cat.campaignCount} campaign{cat.campaignCount !== 1 ? 's' : ''}
                </div>
              </div>
              <h3 className="cat-page-name">{cat.name}</h3>
              <p className="cat-page-desc">{cat.description}</p>
              <span className="cat-page-link" style={{ color: cat.color }}>
                Explore campaigns →
              </span>
              <div className="category-glow" style={{ background: cat.color }}></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
