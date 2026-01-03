import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, ArrowLeft, CheckCircle } from 'lucide-react';

const TripDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this trip?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/trips/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                navigate('/');
            } else {
                alert("Failed to delete trip");
            }
        } catch (error) {
            console.error("Error deleting trip:", error);
        }
    };

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/trips/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTrip(data);
                } else {
                    console.error("Failed to fetch trip");
                }
            } catch (error) {
                console.error("Error fetching trip details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTripDetails();
    }, [id]);

    if (loading) return <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>Loading itinerary...</div>;
    if (!trip) return <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>Trip not found.</div>;

    // Calculate total budget from activities
    const totalCost = trip.stops?.reduce((acc, stop) => {
        return acc + stop.activities.reduce((sum, act) => sum + act.cost, 0);
    }, 0) || 0;

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                    <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleDelete} className="btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    Delete Trip
                </button>
            </div>

            {/* Header Section */}
            <div className="card" style={{
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                padding: '3rem 2rem',
                border: 'none'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to right, rgba(5, 11, 20, 0.9), rgba(5, 11, 20, 0.7)), url(${trip.coverImage || 'https://source.unsplash.com/1600x900/?travel,nature'}) center/cover`,
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {trip.name}
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '1.5rem' }}>
                            {trip.description || "A wonderful journey awaits."}
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={20} color="var(--color-accent-primary)" />
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DollarSign size={20} color="var(--color-success)" />
                                Est. Cost: ${totalCost}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search/Filter Bar (Visual Only as per Screen 9) */}
            <div className="card" style={{ padding: '0.75rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="text" placeholder="Search itinerary..." style={{ background: 'transparent', border: 'none', padding: 0, margin: 0 }} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Group by</button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Filter</button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Sort by</button>
                </div>
            </div>

            {/* Itinerary Grid matching Screen 9 */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                Itinerary for {trip.name}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 150px', gap: '1rem', marginBottom: '1rem', padding: '0 1rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                <div>Timeline</div>
                <div>Physical Activity / Suggestion</div>
                <div>Expense</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {trip.stops?.map((stop, index) => (
                    <React.Fragment key={stop.id}>
                        {/* Day / Stop Marker */}
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 150px', gap: '1rem', alignItems: 'start' }}>
                            <div style={{
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.5rem',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                Day {index + 1}
                            </div>

                            {/* Activities Container */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stop.activities?.map((activity, i) => (
                                    <div key={activity.id} className="card slide-up-hover" style={{
                                        padding: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                        borderLeft: `4px solid ${i % 2 === 0 ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}`,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        height: '200px'
                                    }}>
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.1)), url(${activity.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80'}) center/cover`,
                                            transition: 'transform 0.5s ease'
                                        }} className="bg-img" />

                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem', zIndex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{activity.name}</h3>
                                            </div>
                                            {activity.type && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>{activity.type}</span>}
                                            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                                                {activity.description || "Suggested activity for your trip."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!stop.activities || stop.activities.length === 0) && (
                                    <div className="card" style={{ padding: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                        No specific activities planned for this day.
                                    </div>
                                )}
                            </div>

                            {/* Expense Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stop.activities?.map(activity => (
                                    <div key={`cost-${activity.id}`} style={{
                                        height: '50px', // Approximate alignment height
                                        display: 'flex', alignItems: 'center',
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0 1rem',
                                        fontWeight: 'bold',
                                        color: activity.cost > 0 ? 'var(--color-text-primary)' : 'var(--color-success)'
                                    }}>
                                        {activity.cost > 0 ? `$${activity.cost}` : 'Free'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Connector Line (Visual) */}
                        {index < trip.stops.length - 1 && (
                            <div style={{ width: '2px', height: '30px', background: 'var(--color-border)', marginLeft: '50px', opacity: 0.5 }}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
                    + Add another Section
                </button>
            </div>
        </div>
    );
};

export default TripDetails;
