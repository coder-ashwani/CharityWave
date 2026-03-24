import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateCampaign from './pages/CreateCampaign';
import Dashboard from './pages/Dashboard';
import Support from './pages/Support';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              style: { 
                background: '#1a2035', 
                color: '#fff', 
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              } 
            }} 
          />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/support/*" element={<Support />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
