const express = require('express');
const multer = require('multer');
const { randomUUID } = require('crypto');
const supabase = require('../data/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to map Supabase snake_case to frontend camelCase
const mapCampaign = (c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  shortDescription: c.short_description,
  categoryId: c.category_id,
  userId: c.user_id,
  goalAmount: c.goal_amount,
  raisedAmount: c.raised_amount,
  donorsCount: c.donors_count,
  image: c.image,
  status: c.status,
  featured: c.featured,
  urgent: c.urgent,
  createdAt: c.created_at,
  endDate: c.end_date,
  category: c.categories ? {
    id: c.categories.id,
    name: c.categories.name,
    icon: c.categories.icon,
    color: c.categories.color
  } : null,
  user: c.users ? {
    id: c.users.id,
    name: c.users.name
  } : null,
  progress: c.goal_amount ? Math.round((c.raised_amount / c.goal_amount) * 100) : 0
});

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, urgent, status, sort } = req.query;
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    let query = supabase
      .from('campaigns')
      .select(`
        *,
        categories (id, name, icon, color),
        users (id, name)
      `);

    if (category) query = query.eq('category_id', category);
    if (status) query = query.eq('status', status);
    if (featured === 'true') query = query.eq('featured', true);
    if (urgent === 'true') query = query.eq('urgent', true);
    
    // Supabase ilike search across multiple columns is complex in JS API, usually done via OR
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    if (sort === 'newest') query = query.order('created_at', { ascending: false });
    else if (sort === 'most-funded') query = query.order('raised_amount', { ascending: false });
    else if (sort === 'most-donors') query = query.order('donors_count', { ascending: false });
    else if (sort === 'ending-soon') query = query.order('end_date', { ascending: true });
    else query = query.order('created_at', { ascending: false }); // Default

    const { data: campaigns, error } = await query;

    if (error) throw error;

    const enriched = campaigns.map(mapCampaign);
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch campaigns.' });
  }
});

// Get single campaign
router.get('/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    const { data: c, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        categories (id, name, icon, color),
        users (id, name)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !c) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    const { data: dbDonations, error: dError } = await supabase
      .from('donations')
      .select(`
        *,
        users (id, name)
      `)
      .eq('campaign_id', c.id)
      .order('created_at', { ascending: false });

    if (dError) throw dError;

    const donations = dbDonations.map(d => ({
      id: d.id,
      campaignId: d.campaign_id,
      userId: d.user_id,
      amount: d.amount,
      message: d.message,
      anonymous: d.anonymous,
      createdAt: d.created_at,
      donor: d.anonymous ? { name: 'Anonymous' } : (d.users ? { id: d.users.id, name: d.users.name } : null)
    }));

    res.json({
      ...mapCampaign(c),
      donations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch campaign.' });
  }
});

// Create campaign
router.post('/', authMiddleware, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, shortDescription, categoryId, goalAmount, endDate } = req.body;
    let imageUrl = req.body.image; // fallback to text URL if provided

    if (!title || !description || !categoryId || !goalAmount) {
      return res.status(400).json({ error: 'Title, description, category, and goal amount are required.' });
    }

    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    // Handle file upload to Supabase Storage if an file was attached
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${randomUUID()}.${fileExt}`;
      const filePath = `${req.user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaigns')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image. Make sure your "campaigns" bucket is public and created.' });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('campaigns')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const newCampaignData = {
      title,
      description,
      short_description: shortDescription || description.substring(0, 120) + '...',
      category_id: categoryId,
      user_id: req.user.id,
      goal_amount: Number(goalAmount),
      raised_amount: 0,
      donors_count: 0,
      image: imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800', // Unsplash fallback
      status: 'active',
      featured: false,
      urgent: false,
      end_date: endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { data: c, error } = await supabase
      .from('campaigns')
      .insert([newCampaignData])
      .select(`
        *,
        categories (id, name, icon, color),
        users (id, name)
      `)
      .single();

    if (error) throw error;

    res.status(201).json(mapCampaign(c));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create campaign.' });
  }
});

// Update campaign (authenticated, owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    // Verify ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('campaigns')
      .select('user_id')
      .eq('id', req.params.id)
      .single();
      
    if (fetchErr || !existing) return res.status(404).json({ error: 'Campaign not found' });
    if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    // Prepare update payload mapping camelCase back to snake_case
    const updatableFields = ['title', 'description', 'shortDescription', 'categoryId', 'goalAmount', 'image', 'status', 'endDate'];
    const updateData = {};
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'shortDescription') updateData.short_description = req.body[field];
        else if (field === 'categoryId') updateData.category_id = req.body[field];
        else if (field === 'goalAmount') updateData.goal_amount = req.body[field];
        else if (field === 'endDate') updateData.end_date = req.body[field];
        else updateData[field] = req.body[field];
      }
    });

    const { data: c, error: updateErr } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', req.params.id)
      .select(`
        *,
        categories (id, name, icon, color),
        users (id, name)
      `)
      .single();

    if (updateErr) throw updateErr;

    res.json(mapCampaign(c));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update campaign.' });
  }
});

// Delete campaign (authenticated, owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    const { data: existing, error: fetchErr } = await supabase
      .from('campaigns')
      .select('user_id')
      .eq('id', req.params.id)
      .single();
      
    if (fetchErr || !existing) return res.status(404).json({ error: 'Campaign not found' });
    if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    const { error: delErr } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', req.params.id);

    if (delErr) throw delErr;

    res.json({ message: 'Campaign deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete campaign.' });
  }
});

module.exports = router;
