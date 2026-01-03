const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_hackathon_key';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// GET all trips for a user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            where: { userId: req.user.userId },
            orderBy: { startDate: 'asc' },
        });
        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Helper to get random activities (Curated for Demo)
const getRandomTopActivities = (location) => {
    const loc = location.toLowerCase();

    if (loc.includes('chennai')) {
        return [
            { name: 'Marina Beach Sunrise Walk', cost: 0, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1621239632832-c6517f8b72e1?auto=format&fit=crop&q=80' },
            { name: 'Kapaleeshwarar Temple Visit', cost: 0, type: 'Culture', imageUrl: 'https://images.unsplash.com/photo-1616832626017-f584e030c50d?auto=format&fit=crop&q=80' },
            { name: 'DakshinChitra Museum', cost: 15, type: 'History', imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/8c/2a/39/dakshinachitra-museum.jpg?w=1200&h=-1&s=1' },
            { name: 'Exploring Mahabalipuram', cost: 20, type: 'Sightseeing', imageUrl: 'https://images.unsplash.com/photo-1605634509746-88d44747eb4d?auto=format&fit=crop&q=80' },
            { name: 'T. Nagar Shopping Spree', cost: 50, type: 'Shopping', imageUrl: 'https://images.unsplash.com/photo-1605218427368-35b8092fb1fa?auto=format&fit=crop&q=80' }
        ];
    }

    if (loc.includes('bangalore') || loc.includes('bengaluru')) {
        return [
            { name: 'Cubbon Park Morning Walk', cost: 0, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80' },
            { name: 'Bangalore Palace Tour', cost: 10, type: 'History', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb56fb?auto=format&fit=crop&q=80' },
            { name: 'Microbrewery Hopping in Indiranagar', cost: 60, type: 'Food', imageUrl: 'https://images.unsplash.com/photo-1571216682970-d8868c68eb84?auto=format&fit=crop&q=80' },
            { name: 'Lalbagh Botanical Garden', cost: 5, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1614850388277-c99a0ed30cc8?auto=format&fit=crop&q=80' },
            { name: 'Wonderla Amusement Park', cost: 40, type: 'Adventure', imageUrl: 'https://images.unsplash.com/photo-1623136868208-4122d2f782c5?auto=format&fit=crop&q=80' }
        ];
    }

    if (loc.includes('mysore') || loc.includes('mysuru')) {
        return [
            { name: 'Mysore Palace Illumination', cost: 5, type: 'Sightseeing', imageUrl: 'https://images.unsplash.com/photo-1600100598079-43d93297a7e8?auto=format&fit=crop&q=80' },
            { name: 'Chamundi Hills Trek', cost: 0, type: 'Adventure', imageUrl: 'https://images.unsplash.com/photo-1625904323602-23c2a0ac3500?auto=format&fit=crop&q=80' },
            { name: 'Brindavan Gardens', cost: 2, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1592651478170-692795c6439a?auto=format&fit=crop&q=80' },
            { name: 'Mysore Zoo Visit', cost: 10, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1534567176735-84240f4015cc?auto=format&fit=crop&q=80' },
            { name: 'St. Philomena\'s Cathedral', cost: 0, type: 'History', imageUrl: 'https://images.unsplash.com/photo-1606297341398-32c02114713c?auto=format&fit=crop&q=80' }
        ];
    }

    // Continents / Regions
    if (loc.includes('europe')) {
        return [
            { name: 'Eiffel Tower Visit', cost: 30, type: 'Sightseeing', imageUrl: 'https://images.unsplash.com/photo-1511739001486-915228bc02aa?auto=format&fit=crop&q=80' },
            { name: 'Colosseum Tour', cost: 25, type: 'History', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80' },
            { name: 'Swiss Alps Hiking', cost: 0, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80' },
            { name: 'Amsterdam Canal Cruise', cost: 20, type: 'Relaxation', imageUrl: 'https://images.unsplash.com/photo-1585672913162-841d63654483?auto=format&fit=crop&q=80' },
            { name: 'Santorini Sunset', cost: 0, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4c2ce5d4d?auto=format&fit=crop&q=80' }
        ];
    }

    if (loc.includes('asia')) {
        return [
            { name: 'Great Wall of China Hike', cost: 15, type: 'Adventure', imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80' },
            { name: 'Kyoto Temple Tour', cost: 10, type: 'Culture', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80' },
            { name: 'Bali Beach Day', cost: 0, type: 'Relaxation', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80' },
            { name: 'Taj Mahal Visit', cost: 15, type: 'History', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80' },
            { name: 'Street Food in Bangkok', cost: 20, type: 'Food', imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80' }
        ];
    }

    if (loc.includes('america') || loc.includes('usa')) {
        return [
            { name: 'Grand Canyon Helicopter Tour', cost: 200, type: 'Adventure', imageUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&q=80' },
            { name: 'New York City Sightseeing', cost: 50, type: 'Sightseeing', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&q=80' },
            { name: 'Yosemite National Park', cost: 35, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80' },
            { name: 'Miami Beach Day', cost: 0, type: 'Relaxation', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80' },
            { name: 'Hollywood Walk of Fame', cost: 0, type: 'Culture', imageUrl: 'https://images.unsplash.com/photo-1534050359320-02900022671e?auto=format&fit=crop&q=80' }
        ];
    }

    // Generic Fallback (Reliable Static Images)
    const activitiesList = [
        { name: `Visit ${location} Museum`, cost: 15, type: 'Culture', imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&q=80' },
        { name: 'City Center Walking Tour', cost: 0, type: 'Sightseeing', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80' },
        { name: 'Local Food Tasting', cost: 30, type: 'Food', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80' },
        { name: 'Sunset Viewpoint', cost: 0, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9d856?auto=format&fit=crop&q=80' },
        { name: 'Historic Cathedral', cost: 10, type: 'History', imageUrl: 'https://images.unsplash.com/photo-1548625361-bd872b2ff822?auto=format&fit=crop&q=80' },
        { name: `${location} Botanical Gardens`, cost: 12, type: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80' },
        { name: 'Traditional Market Shopping', cost: 50, type: 'Shopping', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80' }
    ];
    return activitiesList.sort(() => 0.5 - Math.random()).slice(0, 4);
};

// Helper for Coverage Images
const getCoverImage = (location) => {
    const loc = location.toLowerCase();
    if (loc.includes('chennai')) return 'https://images.unsplash.com/photo-1582510003544-4d00b7f00d44?auto=format&fit=crop&q=80';
    if (loc.includes('bangalore') || loc.includes('bengaluru')) return 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80';
    if (loc.includes('mysore') || loc.includes('mysuru')) return 'https://images.unsplash.com/photo-1600100598079-43d93297a7e8?auto=format&fit=crop&q=80';

    if (loc.includes('europe')) return 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80';
    if (loc.includes('asia')) return 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&q=80';
    if (loc.includes('america') || loc.includes('usa')) return 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80';

    // Generic Travel Fallback
    return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80';
};

// POST create a new trip
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Note: 'location' comes from frontend and we use it to name the first Stop
        const { name, startDate, endDate, description, coverImage, location } = req.body;

        if (!name || !startDate || !endDate) {
            return res.status(400).json({ error: 'Name and dates are required' });
        }

        // 1. Create the Trip
        const trip = await prisma.trip.create({
            data: {
                userId: req.user.userId,
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description: description || `Trip to ${location}`,
                coverImage: getCoverImage(location),
            },
        });

        // 2. Create a "Stop" (The City) if location provided
        if (location) {
            // Find or create City (simplified for hackathon: just create a stop linked to a mock city ID or just skip City relation if optional, 
            // BUT schema says Stop needs CityId. Let's make a generic City or try to find one.
            // For simplicity in this step, we'll create a City record on the fly.

            let city = await prisma.city.findFirst({ where: { name: location } });
            if (!city) {
                city = await prisma.city.create({
                    data: {
                        name: location,
                        country: 'Unknown', // We don't have country input yet
                        costIndex: 1.0
                    }
                });
            }

            const stop = await prisma.stop.create({
                data: {
                    tripId: trip.id,
                    cityId: city.id,
                    arrivalDate: new Date(startDate),
                    departureDate: new Date(endDate),
                    order: 1
                }
            });

            // 3. Generate Random Activities for this Stop
            const activities = getRandomTopActivities(location);
            for (const act of activities) {
                await prisma.activity.create({
                    data: {
                        stopId: stop.id,
                        name: act.name,
                        cost: act.cost,
                        type: act.type,
                        imageUrl: act.imageUrl,
                        status: 'planned'
                    }
                });
            }
        }

        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
});

// GET a specific trip by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                stops: {
                    include: {
                        activities: true,
                        city: true
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        if (trip.userId !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

        res.json(trip);
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
});

// DELETE a trip
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        if (trip.userId !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

        await prisma.trip.delete({ where: { id } });
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ error: 'Failed to delete trip' });
    }
});

module.exports = router;
