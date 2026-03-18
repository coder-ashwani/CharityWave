const express = require('express');
const supabase = require('../data/supabase');

const router = express.Router();

// Get platform statistics
router.get('/', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    // Fetch total and active campaigns
    const { data: campaigns, error: campErr } = await supabase
      .from('campaigns')
      .select('id, status, raised_amount, category_id');
      
    if (campErr) throw campErr;

    // Fetch distinct users from donations (to count donors)
    // Supabase JS doesn't have COUNT DISTINCT out of the box, we fetch the subset and count in JS
    const { data: donations, error: donErr } = await supabase
      .from('donations')
      .select('user_id');

    if (donErr) throw donErr;

    // Fetch users count
    const { count: totalUsers, error: userErr } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (userErr) throw userErr;

    // Fetch categories to build category stats
    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('id, name, icon, color');

    if (catErr) throw catErr;

    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalDonations = donations.length;
    const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.raised_amount), 0);
    const totalDonors = new Set(donations.map(d => d.user_id)).size;

    const categoryStats = categories.map(cat => {
      const categoryCampaigns = campaigns.filter(c => c.category_id === cat.id);
      const raised = categoryCampaigns.reduce((sum, c) => sum + Number(c.raised_amount), 0);
      return {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        campaignCount: categoryCampaigns.length,
        totalRaised: raised,
      };
    });

    res.json({
      totalCampaigns,
      activeCampaigns,
      totalDonations,
      totalRaised,
      totalDonors,
      totalUsers,
      categoryStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch platform statistics.' });
  }
});

module.exports = router;
