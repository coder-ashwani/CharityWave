import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import api from '../api';
import CampaignCard from '../components/CampaignCard';
import './Campaigns.css';

export default function Campaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        const res = await api.get(`/campaigns?${params.toString()}`);
        setCampaigns(res.data);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [selectedCategory, sort, search]);

  const handleCategoryClick = (catId) => {
    const newCategory = selectedCategory === catId ? '' : catId;
    setSelectedCategory(newCategory);
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // search effect is handled by the useEffect above
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="campaigns-page" id="campaigns-page">
      <div className="campaigns-hero">
        <div className="campaigns-hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
        </div>
        <div className="container">
          <h1 className="campaigns-hero-title animate-fadeInUp">
            Explore <span className="gradient-text">Campaigns</span>
          </h1>
          <p className="campaigns-hero-subtitle animate-fadeInUp delay-1">
            Discover causes that need your support and make a real difference today.
          </p>

          <form onSubmit={handleSearch} className="search-bar glass animate-fadeInUp delay-2" id="campaign-search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              id="campaign-search-input"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="search-clear" id="search-clear-btn">
                <FiX />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="container campaigns-content">
        {/* Filters */}
        <div className="campaigns-filters animate-fadeInUp">
          <div className="filter-categories">
            <button
              className={`filter-chip ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('')}
              id="filter-all"
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
                style={selectedCategory === cat.id ? { background: cat.color + '22', borderColor: cat.color + '55', color: cat.color } : {}}
                id={`filter-${cat.id}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div className="filter-actions">
            <select
              className="input-field sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              id="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="most-funded">Most Funded</option>
              <option value="most-donors">Most Donors</option>
              <option value="ending-soon">Ending Soon</option>
            </select>

            {(search || selectedCategory) && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters} id="clear-filters-btn">
                <FiX /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state animate-fadeInUp">
            <div className="empty-icon">🔍</div>
            <h3>No campaigns found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <p className="results-count animate-fadeInUp">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} found</p>
            <div className="campaigns-grid animate-fadeInUp">
              {campaigns.map((campaign, index) => (
                <div key={campaign.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fadeInUp">
                  <CampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
