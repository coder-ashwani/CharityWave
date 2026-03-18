const express = require('express');
const supabase = require('../data/supabase');

const router = express.Router();

// Get all categories with campaign count
router.get('/', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');

    if (catError) throw catError;

    // Fetch active campaigns count per category
    const { data: campaigns, error: campError } = await supabase
      .from('campaigns')
      .select('category_id')
      .eq('status', 'active');

    if (campError) throw campError;

    const catCounts = campaigns.reduce((acc, curr) => {
      acc[curr.category_id] = (acc[curr.category_id] || 0) + 1;
      return acc;
    }, {});

    const enriched = categories.map(cat => ({
      ...cat,
      campaignCount: catCounts[cat.id] || 0
    }));

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (catError || !category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const { data: campaigns, error: campError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('category_id', req.params.id);

    if (campError) throw campError;

    res.json({ ...category, campaigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
});

module.exports = router;
