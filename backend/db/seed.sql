INSERT INTO Honors (honor_name, category, class_level) VALUES
-- Friend
('Camping Skill I', 'class', 'Friend'),
('Flowers', 'class', 'Friend'),
('Christian Citizenship (Friend)', 'class', 'Friend'),
('Drawing', 'class', 'Friend'),
('Red Alert', 'class', 'Friend'),

-- Companion
('Camping Skill II', 'class', 'Companion'),
('Cooking (Companion)', 'class', 'Companion'),
('Laundering', 'class', 'Companion'),
('First Aid - Basic', 'class', 'Companion'),
('Birds (Companion)', 'class', 'Companion'),

-- Explorer
('Camping Skill III', 'class', 'Explorer'),
('Family Life', 'class', 'Explorer'),
('Stewardship', 'class', 'Explorer'),
('Nutrition', 'class', 'Explorer'),
('Stars', 'class', 'Explorer'),

-- Ranger
('Camping Skill IV', 'class', 'Ranger'),
('Christian Citizenship (Ranger)', 'class', 'Ranger'),
('Physical Fitness (Ranger)', 'class', 'Ranger'),
('Internet', 'class', 'Ranger'),
('Animal Camouflage', 'class', 'Ranger'),

-- Voyager
('Temperance', 'class', 'Voyager'),
('Prayer', 'class', 'Voyager'),
('Junior Witness', 'class', 'Voyager'),
('Camp Craft (Voyager)', 'class', 'Voyager'),
('Ecology', 'class', 'Voyager'),

-- Guide
('Physical Fitness (Guide)', 'class', 'Guide'),
('Sanctuary', 'class', 'Guide'),
('Lashing', 'class', 'Guide'),
('Basic Sewing', 'class', 'Guide'),
('Environment Conservation', 'class', 'Guide'),

-- General Honors
('Bird', 'general', NULL),
('Animal Tracking', 'general', NULL),
('Tents', 'general', NULL),
('Cooking', 'general', NULL),
('Hiking', 'general', NULL),
('Fire Safety', 'general', NULL),
('Knot Tying', 'general', NULL),
('Drilling & Marching', 'general', NULL),
('Christian Drama', 'general', NULL),
('Flags', 'general', NULL),
('Soccer', 'general', NULL),
('Track and Field', 'general', NULL),
('Agriculture', 'general', NULL),
('Weather', 'general', NULL),
('Basic Rescue', 'general', NULL),
('CPR', 'general', NULL),
('Knitting', 'general', NULL),
('Soap Craft', 'general', NULL),
('Candle Making', 'general', NULL),
('Conflict Resolution', 'general', NULL),
('Adventist Pioneer Heritage', 'general', NULL),
('Sign Language', 'general', NULL),
('Computers', 'general', NULL),
('Social Media', 'general', NULL),
('God''s Messenger', 'general', NULL)
ON CONFLICT (honor_name) DO NOTHING;
