const express = require('express');
const supabase = require('../data/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Make a donation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { campaignId, amount, message, anonymous } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({ error: 'Campaign ID and amount are required.' });
    }

    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    // Fetch campaign to check status
    const { data: campaign, error: campErr } = await supabase
      .from('campaigns')
      .select('status, raised_amount, donors_count, goal_amount')
      .eq('id', campaignId)
      .single();

    if (campErr || !campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (campaign.status !== 'active') return res.status(400).json({ error: 'This campaign is no longer accepting donations.' });

    const numAmount = Number(amount);

    // Insert donation
    const { data: donation, error: donErr } = await supabase
      .from('donations')
      .insert([{
        campaign_id: campaignId,
        user_id: req.user.id,
        amount: numAmount,
        message: message || '',
        anonymous: anonymous || false
      }])
      .select(`
        *,
        users (id, name),
        campaigns (id, title, goal_amount)
      `)
      .single();

    if (donErr) throw donErr;

    // Update campaign stats
    const newRaised = Number(campaign.raised_amount) + numAmount;
    const newDonorsCount = Number(campaign.donors_count) + 1;
    const newStatus = newRaised >= Number(campaign.goal_amount) ? 'completed' : 'active';

    const { error: updateErr } = await supabase
      .from('campaigns')
      .update({
        raised_amount: newRaised,
        donors_count: newDonorsCount,
        status: newStatus
      })
      .eq('id', campaignId);

    if (updateErr) throw updateErr;

    res.status(201).json({
      id: donation.id,
      campaignId: donation.campaign_id,
      userId: donation.user_id,
      amount: donation.amount,
      message: donation.message,
      anonymous: donation.anonymous,
      createdAt: donation.created_at,
      donor: donation.anonymous ? { name: 'Anonymous' } : { id: donation.users.id, name: donation.users.name },
      campaign: { 
        id: donation.campaigns.id, 
        title: donation.campaigns.title, 
        progress: Math.round((newRaised / Number(donation.campaigns.goal_amount)) * 100) 
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process donation.' });
  }
});

// Get user's donation history
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    const { data: donations, error } = await supabase
      .from('donations')
      .select(`
        *,
        campaigns (id, title, image)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = donations.map(d => ({
      id: d.id,
      campaignId: d.campaign_id,
      userId: d.user_id,
      amount: d.amount,
      message: d.message,
      anonymous: d.anonymous,
      createdAt: d.created_at,
      campaign: d.campaigns ? {
        id: d.campaigns.id,
        title: d.campaigns.title,
        image: d.campaigns.image
      } : null
    }));

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch donations.' });
  }
});

// Get recent public donations for ticker
router.get('/recent', async (req, res) => {
  try {
    const { data: donations, error } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        anonymous,
        created_at,
        users (name),
        campaigns (title)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const mapped = donations.map(d => ({
      id: d.id,
      amount: d.amount,
      donorName: d.anonymous ? 'Anonymous' : (d.users?.name || 'A Kind Donor'),
      campaignTitle: d.campaigns?.title || 'a great cause',
      createdAt: d.created_at
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Recent Donations Error:', err);
    res.status(500).json({ error: 'Failed to fetch recent activity.' });
  }
});

module.exports = router;
