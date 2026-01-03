import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit2, Calendar, Layout } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        // Refresh user data from storage
        setUser(JSON.parse(localStorage.getItem('user') || '{}'));

        // Fetch user's trips
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/trips', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTrips(data);
                }
            } catch (error) {
                console.error('Error fetching trips', error);
            }
        };
        fetchTrips();
    }, []);

    return (
        <div className="container fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>

                {/* Profile Card */}
                <div className="card" style={{ textAlign: 'center', position: 'sticky', top: '100px' }}>
                    <div style={{
                        width: '150px', height: '150px', margin: '0 auto 1.5rem',
                        borderRadius: '50%', overflow: 'hidden',
                        border: '4px solid var(--color-bg-secondary)',
                        boxShadow: '0 0 20px var(--color-accent-glow)'
                    }}>
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff&size=200`}
                            alt={user.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{user.name}</h2>
                    <div style={{ display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-accent-primary)', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Travel Enthusiast
                    </div>

                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            <Mail size={18} color="var(--color-text-muted)" /> {user.email}
                        </div>
                        {user.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                <Phone size={18} color="var(--color-text-muted)" /> {user.phone}
                            </div>
                        )}
                        {user.city && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                <MapPin size={18} color="var(--color-text-muted)" /> {user.city}, {user.country}
                            </div>
                        )}
                    </div>

                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                        <Edit2 size={16} /> Edit Profile
                    </button>
                </div>

                {/* Trips Section */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layout size={24} color="var(--color-accent-secondary)" />
                        Preplanned Trips
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {trips.length > 0 ? trips.map(trip => (
                            <div key={trip.id} className="card slide-up-hover" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ height: '160px', position: 'relative' }}>
                                    <img src={trip.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80'} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute', bottom: '0', left: '0', right: '0',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                        padding: '1rem'
                                    }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{trip.name}</h3>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        <Calendar size={14} />
                                        {new Date(trip.startDate).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/trips/${trip.id}`)}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                No trips planned yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
