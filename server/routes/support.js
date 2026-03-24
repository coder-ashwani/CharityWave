const express = require('express');
const router = express.Router();
const supabase = require('../data/supabase');

// POST /api/support/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Message sent successfully!', data });
  } catch (error) {
    console.error('Support Route Error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
