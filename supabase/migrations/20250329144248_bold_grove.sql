/*
  # Add New Experiences
  
  1. Changes
    - Add new art experiences
    - Add new education experiences
    - Add new wellness experiences
    - Set appropriate pricing in experience_dates
    
  2. Data
    - Art category: sketch class, glass blowing, ratang workshop, clay sculpture, kokadama workshop, silver workshop
    - Education category: music creation, music promotion, AI workshop, Phoenix recycle lecture, magic garden, biota lab
    - Wellness category: yoga, Latin dance, zumba, stretching, sound healing, gong meditation, breath works
*/

-- Insert new experiences
WITH manager_user AS (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'manager' LIMIT 1
)
INSERT INTO public.experiences (
  name,
  description,
  category,
  image_url,
  created_by,
  is_visible
)
SELECT
  name,
  description,
  category::experience_category,
  image_url,
  manager_user.id,
  true
FROM (
  VALUES
    -- Art Category
    (
      'Sketch Class',
      'Learn fundamental sketching techniques and develop your artistic skills in this engaging class.',
      'art',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80'
    ),
    (
      'Glass Blowing Workshop',
      'Experience the ancient art of glass blowing and create your own unique glass piece.',
      'art',
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80'
    ),
    (
      'Rattan Weaving Workshop',
      'Learn traditional rattan weaving techniques and create sustainable home decor items.',
      'art',
      'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&q=80'
    ),
    (
      'Clay Sculpture Workshop',
      'Explore the tactile art of clay sculpting and create your own ceramic masterpiece.',
      'art',
      'https://images.unsplash.com/photo-1516981879613-9f5da904015f?auto=format&fit=crop&q=80'
    ),
    (
      'Kokedama Workshop',
      'Create beautiful Japanese moss ball gardens in this hands-on workshop.',
      'art',
      'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&q=80'
    ),
    (
      'Silver Jewelry Workshop',
      'Design and craft your own silver jewelry using traditional metalworking techniques.',
      'art',
      'https://images.unsplash.com/photo-1617038220319-c8a1703fb2c4?auto=format&fit=crop&q=80'
    ),
    
    -- Education Category
    (
      'Music Creation Workshop',
      'Learn professional music production techniques using industry-standard software and equipment.',
      'education',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80'
    ),
    (
      'Music Promotion Masterclass',
      'Master the art of music promotion and marketing in the digital age.',
      'education',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80'
    ),
    (
      'AI Practical Workshop',
      'Get hands-on experience with AI tools and learn practical applications.',
      'education',
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80'
    ),
    (
      'Phoenix Recycle Lecture',
      'Learn about sustainable waste management and recycling practices.',
      'education',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80'
    ),
    (
      'Magic Garden Workshop',
      'Discover the magic of gardening and learn about plant care and cultivation.',
      'education',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80'
    ),
    (
      'Biota Lab Experience',
      'Explore marine biology and learn about ocean conservation.',
      'education',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80'
    ),
    
    -- Wellness Category
    (
      'Sunset Yoga Flow',
      'Experience a calming yoga session with stunning sunset views.',
      'wellness',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80'
    ),
    (
      'Latin Dance Class',
      'Learn popular Latin dance styles in this energetic and fun class.',
      'wellness',
      'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80'
    ),
    (
      'Zumba Dance Party',
      'Get fit with this high-energy dance workout combining Latin rhythms.',
      'wellness',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80'
    ),
    (
      'Dynamic Stretching Flow',
      'Improve flexibility and mobility through guided stretching sequences.',
      'wellness',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80'
    ),
    (
      'Sound Healing Journey',
      'Experience deep relaxation through the power of sound therapy.',
      'wellness',
      'https://images.unsplash.com/photo-1591291621060-89dd2673b51b?auto=format&fit=crop&q=80'
    ),
    (
      'Gong Bath Meditation',
      'Immerse yourself in the healing vibrations of the gong.',
      'wellness',
      'https://images.unsplash.com/photo-1591291675190-eafd25234d4c?auto=format&fit=crop&q=80'
    ),
    (
      'Breathwork Workshop',
      'Learn powerful breathing techniques for stress relief and vitality.',
      'wellness',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80'
    )
  ) AS t (name, description, category, image_url)
  CROSS JOIN manager_user
ON CONFLICT (id) DO UPDATE 
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  is_visible = EXCLUDED.is_visible,
  updated_at = now();

-- Insert default time slots for each experience
INSERT INTO experience_dates (
  experience_id,
  start_time,
  end_time,
  is_recurring,
  recurrence_type,
  weekdays,
  weekly_start,
  weekly_end,
  is_paid,
  price
)
SELECT 
  e.id,
  '10:00',
  '12:00',
  true,
  'weekly',
  ARRAY['monday', 'wednesday', 'friday'],
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '2 months',
  true,
  CASE 
    WHEN e.name IN ('Glass Blowing Workshop', 'Silver Jewelry Workshop', 'Music Creation Workshop', 'Music Promotion Masterclass', 'AI Practical Workshop')
    THEN 500000
    WHEN e.name IN ('Latin Dance Class')
    THEN 200000
    WHEN e.name IN ('Sound Healing Journey', 'Gong Bath Meditation')
    THEN 300000
    ELSE 150000
  END
FROM experiences e
WHERE e.name IN (
  'Sketch Class',
  'Glass Blowing Workshop',
  'Rattan Weaving Workshop',
  'Clay Sculpture Workshop',
  'Kokedama Workshop',
  'Silver Jewelry Workshop',
  'Music Creation Workshop',
  'Music Promotion Masterclass',
  'AI Practical Workshop',
  'Phoenix Recycle Lecture',
  'Magic Garden Workshop',
  'Biota Lab Experience',
  'Sunset Yoga Flow',
  'Latin Dance Class',
  'Zumba Dance Party',
  'Dynamic Stretching Flow',
  'Sound Healing Journey',
  'Gong Bath Meditation',
  'Breathwork Workshop'
)
ON CONFLICT DO NOTHING;