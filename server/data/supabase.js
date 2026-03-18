const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('🔗 Connected to Supabase');
} else {
  console.warn('⚠️  Supabase keys not configured properly. Ensure valid SUPABASE_URL and SUPABASE_KEY are in .env');
}

module.exports = supabase;
