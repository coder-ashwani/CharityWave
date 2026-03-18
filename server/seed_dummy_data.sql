-- 1. Insert Dummy Users
-- We use fixed UUIDs so we can reference them easily in the campaigns and donations tables below.
INSERT INTO public.users (id, name, email, password, role, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Ashwani Agrawal', 'ashwani@example.com', '$2b$10$fcARMlsq9xVhVyKHHr85ieHIHMcfPAk9yeSMNj1E3XH8PQiXDuuL2', 'donor', '2024-01-15 10:00:00+00'),
('22222222-2222-2222-2222-222222222222', 'Priya Sharma', 'priya@example.com', '$2b$10$fcARMlsq9xVhVyKHHr85ieHIHMcfPAk9yeSMNj1E3XH8PQiXDuuL2', 'requester', '2024-02-10 10:00:00+00')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Dummy Campaigns
-- We use subqueries to dynamically grab the correct category ID from your running Supabase instance.
INSERT INTO public.campaigns (id, title, description, short_description, category_id, user_id, goal_amount, raised_amount, donors_count, image, status, featured, urgent, created_at, end_date) VALUES
('aa111111-1111-1111-1111-111111111111', 'Help Ravi Complete His Engineering Degree', 
'Ravi comes from a small village in Rajasthan. His father is a daily wage laborer and his mother works as a domestic helper. Despite all odds, Ravi secured admission in IIT Delhi. He needs financial support for tuition fees, hostel accommodation, and study materials.', 
'Support a bright student from Rajasthan complete his IIT Delhi engineering degree.', 
(SELECT id FROM public.categories WHERE name = 'Education' LIMIT 1), '22222222-2222-2222-2222-222222222222', 500000, 325000, 4, 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800', 'active', true, false, '2024-06-15 10:00:00+00', '2025-06-15 10:00:00+00'),

('aa222222-2222-2222-2222-222222222222', 'Surgery Fund for Baby Ananya', 
'Baby Ananya, just 8 months old, was diagnosed with a congenital heart defect. Her parents, Meena and Suresh, are struggling to arrange ₹8,00,000 for the life-saving surgery. Every minute counts for this little angel. Please help save this precious life.', 
'Help fund a life-saving heart surgery for an 8-month-old baby.', 
(SELECT id FROM public.categories WHERE name = 'Healthcare' LIMIT 1), '22222222-2222-2222-2222-222222222222', 800000, 612000, 4, 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800', 'active', true, true, '2024-07-01 10:00:00+00', '2025-03-01 10:00:00+00'),

('aa333333-3333-3333-3333-333333333333', 'Rural Cricket Academy Equipment', 
'We are building a cricket academy in a rural area of Maharashtra where talented children have no access to proper training facilities. We need to purchase cricket kits, install nets, prepare pitches, and hire qualified coaches.', 
'Equip a rural cricket academy to nurture young talent from Maharashtra.', 
(SELECT id FROM public.categories WHERE name = 'Sports' LIMIT 1), '22222222-2222-2222-2222-222222222222', 300000, 178000, 1, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 'active', false, false, '2024-08-10 10:00:00+00', '2025-08-10 10:00:00+00'),

('aa444444-4444-4444-4444-444444444444', 'Plant 10,000 Trees in Uttarakhand', 
'The forests of Uttarakhand have been devastated by wildfires and illegal logging. Our initiative aims to plant 10,000 native trees across 50 hectares of degraded forest land. Each tree costs just ₹50 to plant and maintain.', 
'Restore Uttarakhand forests by planting 10,000 native trees.', 
(SELECT id FROM public.categories WHERE name = 'Environment' LIMIT 1), '11111111-1111-1111-1111-111111111111', 500000, 423000, 2, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', 'active', true, false, '2024-05-20 10:00:00+00', '2025-12-31 10:00:00+00'),

('aa555555-5555-5555-5555-555555555555', 'Flood Relief for Kerala Families', 
'Devastating floods have displaced thousands of families in Kerala. They have lost their homes, belongings, and livelihoods. We are providing emergency relief kits containing food, clean water, medicines, and temporary shelter materials.', 
'Provide emergency relief kits to flood-displaced families in Kerala.', 
(SELECT id FROM public.categories WHERE name = 'Emergency' LIMIT 1), '11111111-1111-1111-1111-111111111111', 1000000, 756000, 5, 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800', 'active', true, true, '2024-07-15 10:00:00+00', '2025-01-15 10:00:00+00'),

('aa666666-6666-6666-6666-666666666666', 'Digital Classrooms for Tribal Schools', 
'Tribal communities in Jharkhand lack access to modern education. We plan to set up 10 digital classrooms equipped with smart boards, tablets, projectors, and educational software. Teachers will be trained to use digital tools effectively.', 
'Set up 10 digital classrooms to benefit 2,000+ tribal students in Jharkhand.', 
(SELECT id FROM public.categories WHERE name = 'Technology' LIMIT 1), '11111111-1111-1111-1111-111111111111', 600000, 201000, 1, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', 'active', false, false, '2024-09-15 10:00:00+00', '2025-09-15 10:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Dummy Donations
INSERT INTO public.donations (id, campaign_id, user_id, amount, message, anonymous, created_at) VALUES
(uuid_generate_v4(), 'aa111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 5000, 'Best wishes for your studies!', false, '2024-07-01 10:00:00+00'),
(uuid_generate_v4(), 'aa222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 10000, 'Prayers for baby Ananya', false, '2024-07-15 10:00:00+00'),
(uuid_generate_v4(), 'aa444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 2500, 'Go green!', true, '2024-06-01 10:00:00+00'),
(uuid_generate_v4(), 'aa555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 15000, 'Stay strong Kerala', false, '2024-07-20 10:00:00+00')
ON CONFLICT (id) DO NOTHING;
