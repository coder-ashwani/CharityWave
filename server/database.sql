-- Execute this entire file in your Supabase SQL Editor

-- 1. Create Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'donor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Categories Table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT
);

-- 3. Create Campaigns Table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  goal_amount NUMERIC NOT NULL,
  raised_amount NUMERIC DEFAULT 0,
  donors_count INTEGER DEFAULT 0,
  image TEXT,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL
);

-- 4. Create Donations Table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  message TEXT,
  anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: We are using our own users table for simplicity in matching our old Express data structure,
-- rather than Supabase Auth implicitly. This gives you exact parity with the prior setup.

-- 5. Insert Initial Categories Setup
INSERT INTO public.categories (name, icon, color, description) VALUES
('Education', '📚', '#6366f1', 'Support students with tuition, books, and supplies'),
('Healthcare', '🏥', '#ec4899', 'Help cover medical bills and treatments'),
('Sports', '⚽', '#f59e0b', 'Fund athletic equipment and training programs'),
('Environment', '🌍', '#10b981', 'Support environmental conservation initiatives'),
('Community', '🏘️', '#8b5cf6', 'Strengthen local communities through development'),
('Emergency', '🚨', '#ef4444', 'Provide immediate relief for emergencies'),
('Animals', '🐾', '#f97316', 'Rescue and care for animals in need'),
('Technology', '💻', '#06b6d4', 'Bridge the digital divide with tech access');
