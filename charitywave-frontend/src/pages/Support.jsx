import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiHelpCircle, FiFileText, FiPhone, FiInfo } from 'react-icons/fi';
import './Support.css';

export default function Support() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('how-it-works');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && ['how-it-works', 'faqs', 'contact', 'privacy'].includes(path)) {
      setActiveTab(path);
    }
  }, [location]);

  const tabs = [
    { id: 'how-it-works', title: 'How it Works', icon: <FiInfo /> },
    { id: 'faqs', title: 'FAQs', icon: <FiHelpCircle /> },
    { id: 'contact', title: 'Contact Us', icon: <FiPhone /> },
    { id: 'privacy', title: 'Privacy Policy', icon: <FiFileText /> },
  ];

  const faqs = [
    { q: 'How do I start a campaign?', a: 'To start a campaign, you need to register as a requester. Once logged in, go to "Start a Campaign" and fill in the details about your cause.' },
    { q: 'Are there any platform fees?', a: 'CharityWave is committed to transparency. We charge a minimal 5% platform fee to maintain the service and cover transaction costs.' },
    { q: 'How do I receive my donations?', a: 'Donations are transferred to your connected bank account or stripe account once the campaign reaches its target or its specified timeline.' },
    { q: 'Can I donate anonymously?', a: 'Yes! When making a donation, simply check the "Donate Anonymously" box to hide your name from the public.' }
  ];

  return (
    <div className="support-page container">
      <div className="support-header animate-fadeInUp">
        <h1 className="gradient-text">Support <span className="highlight-text">& Help Center</span></h1>
        <p className="subtitle">Everything you need to know about navigating the Wave of change.</p>
      </div>

      <div className="support-layout">
        <aside className="support-sidebar animate-fadeInLeft">
          <div className="tabs-nav glass">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.title}
              </button>
            ))}
          </div>
        </aside>

        <main className="support-content animate-fadeInUp delay-1 glass">
          {activeTab === 'how-it-works' && (
            <div className="content-section">
              <h2>🌊 How <span className="gradient-text">CharityWave</span> Works</h2>
              <div className="support-steps-grid">
                <div className="support-step-card">
                  <div className="step-number">01</div>
                  <h3>Create Account</h3>
                  <p>Join as a Donor or Requester. It takes less than 2 minutes to get started.</p>
                </div>
                <div className="support-step-card">
                  <div className="step-number">02</div>
                  <h3>Share Story</h3>
                  <p>Tell the world why your cause matters with images, videos, and compelling stories.</p>
                </div>
                <div className="support-step-card">
                  <div className="step-number">03</div>
                  <h3>Receive Impact</h3>
                  <p>Securely collect donations and keep your supporters updated on the progress.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="content-section">
              <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4>{faq.q}</h4>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="content-section">
              <h2>Get in <span className="gradient-text">Touch</span></h2>
              <p>Have questions? Our team is here to help you ride the wave successfully.</p>
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="input-field" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="input-field" placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="input-field" rows="4" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="content-section">
              <h2>Privacy <span className="gradient-text">Policy</span></h2>
              <p>Your trust is our most valuable asset. Learn how we protect your data.</p>
              <div className="privacy-text text-muted">
                <p>CharityWave is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
                <h4>1. Data Collection</h4>
                <p>We collect information you provide directly to us when you create an account, make a donation, or communicate with us.</p>
                <h4>2. Transparency</h4>
                <p>Donor names are public unless you choose to donate anonymously. Requesters are required to provide verifiable information for trust.</p>
                <h4>3. Security</h4>
                <p>We use industry-standard encryption to protect your sensitive data and payment information.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
