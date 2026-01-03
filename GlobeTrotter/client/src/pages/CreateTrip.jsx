import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Type, Image as ImageIcon, ArrowLeft, Globe } from 'lucide-react';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user.id,
                    // Auto-generate a nice cover image based on location if not provided
                    coverImage: `https://source.unsplash.com/1600x900/?${encodeURIComponent(formData.location || 'travel')}`
                }),
            });

            if (!response.ok) throw new Error('Failed to create trip');

            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error creating trip. Please ensure server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="card" style={{ padding: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '12px', height: '12px', background: 'var(--color-accent-primary)', borderRadius: '50%' }}></div>
                    Plan a new trip
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Trip Name */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Trip Name</label>
                            <div style={{ position: 'relative' }}>
                                <Type size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Summer Vacation 2026"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '3rem', fontSize: '1.1rem', background: 'rgba(30, 41, 59, 1)' }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select a Place</label>
                            <div style={{ position: 'relative' }}>
                                <Globe size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Where are you going?"
                                    value={formData.location}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '3rem', fontSize: '1.1rem', background: 'rgba(30, 41, 59, 1)' }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Start Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        style={{ paddingLeft: '3rem', background: 'rgba(30, 41, 59, 1)' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>End Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        style={{ paddingLeft: '3rem', background: 'rgba(30, 41, 59, 1)' }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions Grid (Mock UI Only as per wireframe) */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: 'var(--color-accent-secondary)' }}>
                            Suggestions for Places to Visit / Activities
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} style={{
                                    height: '120px',
                                    border: '1px dashed var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.9rem'
                                }}>
                                    Suggestion {i}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }} disabled={loading}>
                            {loading ? 'Creating Trip...' : 'Start Planning'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateTrip;
