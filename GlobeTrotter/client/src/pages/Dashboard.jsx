import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Search, Filter, Layers, Clock } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/trips', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Format dates and add status based on date
                    const now = new Date();
                    const formattedData = data.map(trip => {
                        const start = new Date(trip.startDate);
                        const end = new Date(trip.endDate);
                        let status = 'upcoming';
                        if (now > end) status = 'completed';
                        else if (now >= start && now <= end) status = 'ongoing';

                        return {
                            ...trip,
                            startDate: start.toLocaleDateString(),
                            endDate: end.toLocaleDateString(),
                            status
                        };
                    });
                    setTrips(formattedData);
                }
            } catch (error) {
                console.error('Failed to fetch trips', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const filteredTrips = trips.filter(trip =>
        trip.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header / Banner Section */}
            <div className="card" style={{
                marginTop: '1rem',
                marginBottom: '2rem',
                height: '250px',
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000) center/cover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        Welcome, {user.name}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#e2e8f0', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                        Where will your next adventure take you?
                    </p>
                </div>
            </div>

            {/* Search & Actions Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search your trips..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '3rem', height: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary">
                        <Layers size={18} /> Group by
                    </button>
                    <button className="btn btn-secondary">
                        <Filter size={18} /> Filter
                    </button>
                </div>
                <Link to="/create-trip" className="btn btn-primary" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <Plus size={20} /> Plan a Trip
                </Link>
            </div>

            {/* Top Regional Selections */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={24} color="var(--color-accent-primary)" />
                    Top Regional Selections
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { name: 'Europe', img: 'https://images.unsplash.com/photo-1471341971474-27361b1b1836?auto=format&fit=crop&q=80' },
                        { name: 'Asia', img: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&q=80' },
                        { name: 'Americas', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80' },
                        { name: 'Africa', img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80' },
                        { name: 'Oceania', img: 'https://images.unsplash.com/photo-1523482580672-01e6f283a04d?auto=format&fit=crop&q=80' }
                    ].map((region, idx) => (
                        <div key={idx} className="card region-card" style={{
                            height: '140px',
                            padding: 0,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: 'none'
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url(${region.img}) center/cover`,
                                transition: 'transform 0.5s ease',
                            }} className="bg-img" />
                            <span style={{
                                position: 'absolute', bottom: '1rem', left: '0', right: '0',
                                textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', zIndex: 1
                            }}>{region.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Previous Trips (My Trips) */}
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={24} color="var(--color-accent-secondary)" />
                    My Trips
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading trips...</div>
                ) : filteredTrips.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {filteredTrips.map(trip => (
                            <div key={trip.id} className="card trip-card slide-up-hover" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '180px', position: 'relative' }}>
                                    <img src={trip.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80'} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute', top: '1rem', right: '1rem',
                                        padding: '0.25rem 0.75rem', borderRadius: '20px',
                                        fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase',
                                        background: trip.status === 'completed' ? 'var(--color-text-muted)' : trip.status === 'ongoing' ? 'var(--color-success)' : 'var(--color-accent-primary)',
                                        color: '#fff'
                                    }}>
                                        {trip.status}
                                    </div>
                                </div>
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{trip.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        <Calendar size={16} />
                                        <span>{trip.startDate} - {trip.endDate}</span>
                                    </div>
                                    <div style={{ marginTop: 'auto' }}>
                                        <Link to={`/trips/${trip.id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No trips found matching your search.</p>
                        <Link to="/create-trip" className="btn btn-primary">Start Planning</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
