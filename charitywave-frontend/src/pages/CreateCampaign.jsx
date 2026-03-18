import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlusCircle, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './CreateCampaign.css';

export default function CreateCampaign() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    goalAmount: '',
    image: '',
    imageFile: null,
    endDate: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create a campaign');
      navigate('/login');
      return;
    }
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, [isAuthenticated, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm(prev => ({ ...prev, imageFile: file, image: URL.createObjectURL(file) }));
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.categoryId || !form.goalAmount) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('shortDescription', form.shortDescription);
      formData.append('categoryId', form.categoryId);
      formData.append('goalAmount', form.goalAmount);
      if (form.endDate) formData.append('endDate', form.endDate);
      
      // If user selected a file
      if (form.imageFile) {
        formData.append('imageFile', form.imageFile);
      } else if (form.image) {
        // Fallback to text URL if they clicked a sample
        formData.append('image', form.image);
      }

      // We need to pass the proper headers for FormData
      const res = await api.post('/campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Campaign created successfully! 🎉');
      navigate(`/campaigns/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
  ];

  return (
    <div className="create-campaign-page" id="create-campaign-page">
      <div className="container">
        <Link to="/campaigns" className="back-link animate-fadeInUp">
          <FiArrowLeft /> Back to Campaigns
        </Link>

        <div className="create-campaign-layout animate-fadeInUp">
          <div className="create-campaign-header">
            <span className="section-label">Start a Campaign</span>
            <h1>Tell Your <span className="gradient-text">Story</span></h1>
            <p>Create a campaign and share your cause with the world. Every great change starts with one story.</p>
          </div>

          <form onSubmit={handleSubmit} className="create-campaign-form glass">
            <div className="input-group">
              <label htmlFor="camp-title">Campaign Title *</label>
              <input
                id="camp-title"
                name="title"
                type="text"
                className="input-field"
                placeholder="Give your campaign a compelling title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="camp-short-desc">Short Description</label>
              <input
                id="camp-short-desc"
                name="shortDescription"
                type="text"
                className="input-field"
                placeholder="A brief one-line summary (shown on cards)"
                value={form.shortDescription}
                onChange={handleChange}
                maxLength={150}
              />
            </div>

            <div className="input-group">
              <label htmlFor="camp-description">Full Description *</label>
              <textarea
                id="camp-description"
                name="description"
                className="input-field"
                placeholder="Tell people why this cause matters..."
                value={form.description}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="camp-category">Category *</label>
                <select
                  id="camp-category"
                  name="categoryId"
                  className="input-field"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="camp-goal">Goal Amount (₹) *</label>
                <input
                  id="camp-goal"
                  name="goalAmount"
                  type="number"
                  className="input-field"
                  placeholder="e.g. 500000"
                  value={form.goalAmount}
                  onChange={handleChange}
                  min="100"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="camp-end-date">End Date</label>
              <input
                id="camp-end-date"
                name="endDate"
                type="date"
                className="input-field"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="camp-image"><FiImage /> Upload Cover Image</label>
              <input
                id="camp-image"
                name="imageFile"
                type="file"
                accept="image/*"
                className="input-field"
                onChange={handleFileChange}
                style={{ padding: '10px' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--cw-text-muted)' }}>Or pick a sample image below (if you don't want to upload):</span>
              <div className="sample-images">
                {sampleImages.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`sample-image-btn ${form.image === url ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, image: url, imageFile: null }))}
                  >
                    <img src={url} alt={`Sample ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Campaign preview" />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="create-campaign-submit">
              <FiPlusCircle />
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
