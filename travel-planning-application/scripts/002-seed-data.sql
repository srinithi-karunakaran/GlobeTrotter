-- Seed cities
INSERT OR IGNORE INTO cities (id, name, country, cost_index, popularity, description) VALUES
(1, 'Paris', 'France', 75, 95, 'The City of Light, famous for art, culture, and cuisine'),
(2, 'Tokyo', 'Japan', 80, 90, 'A vibrant metropolis blending tradition and modernity'),
(3, 'New York', 'USA', 85, 92, 'The city that never sleeps, iconic skyline and culture'),
(4, 'Barcelona', 'Spain', 65, 88, 'Mediterranean charm with stunning architecture'),
(5, 'Bangkok', 'Thailand', 40, 85, 'Street food paradise with rich temples and markets'),
(6, 'London', 'UK', 82, 91, 'Historic capital with world-class museums and culture'),
(7, 'Dubai', 'UAE', 78, 83, 'Futuristic city with luxury shopping and desert adventures'),
(8, 'Rome', 'Italy', 68, 89, 'Ancient city with incredible history and cuisine'),
(9, 'Bali', 'Indonesia', 45, 86, 'Tropical paradise with beaches, temples, and culture'),
(10, 'Sydney', 'Australia', 77, 84, 'Harbor city with iconic opera house and beaches'),
(11, 'Istanbul', 'Turkey', 55, 82, 'Where East meets West, rich in history and culture'),
(12, 'Amsterdam', 'Netherlands', 70, 87, 'Canal city famous for art, cycling, and liberal culture'),
(13, 'Singapore', 'Singapore', 85, 88, 'Garden city with futuristic architecture and cuisine'),
(14, 'Prague', 'Czech Republic', 50, 81, 'Medieval charm with stunning castles and beer culture'),
(15, 'Lisbon', 'Portugal', 58, 83, 'Coastal capital with historic trams and pastéis de nata');

-- Seed activities for Paris
INSERT OR IGNORE INTO activities (city_id, name, description, category, estimated_cost, duration_hours) VALUES
(1, 'Visit the Eiffel Tower', 'Iconic iron tower with stunning city views', 'Sightseeing', 25.00, 3),
(1, 'Louvre Museum Tour', 'World-famous art museum home to the Mona Lisa', 'Culture', 17.00, 4),
(1, 'Seine River Cruise', 'Romantic boat ride through the heart of Paris', 'Leisure', 15.00, 1),
(1, 'Montmartre Walking Tour', 'Explore the artistic hilltop neighborhood', 'Culture', 20.00, 3),
(1, 'French Cooking Class', 'Learn to make authentic French cuisine', 'Food', 95.00, 4);

-- Seed activities for Tokyo
INSERT OR IGNORE INTO activities (city_id, name, description, category, estimated_cost, duration_hours) VALUES
(2, 'Visit Senso-ji Temple', 'Ancient Buddhist temple in Asakusa', 'Culture', 0.00, 2),
(2, 'Tsukiji Fish Market Tour', 'Experience the world-famous fish market', 'Food', 30.00, 3),
(2, 'Tokyo Skytree Observation', 'Panoramic views from Tokyo''s tallest structure', 'Sightseeing', 28.00, 2),
(2, 'Shibuya Crossing Experience', 'Walk the world''s busiest pedestrian crossing', 'Sightseeing', 0.00, 1),
(2, 'Traditional Tea Ceremony', 'Experience authentic Japanese tea culture', 'Culture', 45.00, 2);

-- Seed activities for New York
INSERT OR IGNORE INTO activities (city_id, name, description, category, estimated_cost, duration_hours) VALUES
(3, 'Statue of Liberty Tour', 'Visit America''s iconic symbol of freedom', 'Sightseeing', 23.00, 4),
(3, 'Central Park Bike Tour', 'Explore NYC''s famous urban park', 'Leisure', 40.00, 3),
(3, 'Broadway Show', 'Experience world-class theater', 'Entertainment', 150.00, 3),
(3, 'Metropolitan Museum of Art', 'One of the world''s largest art museums', 'Culture', 25.00, 4),
(3, 'Brooklyn Bridge Walk', 'Walk across the historic suspension bridge', 'Sightseeing', 0.00, 2);

-- Seed activities for Barcelona
INSERT OR IGNORE INTO activities (city_id, name, description, category, estimated_cost, duration_hours) VALUES
(4, 'Sagrada Familia Tour', 'Gaudí''s unfinished masterpiece basilica', 'Culture', 26.00, 2),
(4, 'Park Güell Visit', 'Colorful mosaic park designed by Gaudí', 'Sightseeing', 10.00, 2),
(4, 'Gothic Quarter Walking Tour', 'Explore medieval streets and history', 'Culture', 15.00, 3),
(4, 'Tapas Food Tour', 'Sample authentic Spanish tapas', 'Food', 65.00, 3),
(4, 'Beach Day at Barceloneta', 'Relax on Barcelona''s famous beach', 'Leisure', 0.00, 4);

-- Seed activities for Bangkok
INSERT OR IGNORE INTO activities (city_id, name, description, category, estimated_cost, duration_hours) VALUES
(5, 'Grand Palace Tour', 'Stunning royal palace complex', 'Culture', 15.00, 3),
(5, 'Floating Market Visit', 'Traditional Thai market on water', 'Culture', 20.00, 4),
(5, 'Street Food Tour', 'Sample Bangkok''s incredible street food', 'Food', 25.00, 3),
(5, 'Temple of Dawn (Wat Arun)', 'Beautiful riverside Buddhist temple', 'Culture', 3.00, 2),
(5, 'Thai Massage Experience', 'Traditional therapeutic Thai massage', 'Wellness', 15.00, 2);
