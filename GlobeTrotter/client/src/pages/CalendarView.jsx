import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalendarView = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [trips, setTrips] = useState([]);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
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
                console.error('Error fetching trips for calendar', error);
            }
        };
        fetchTrips();
    }, []);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const isDateInTrip = (day, trip) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        checkDate.setHours(0, 0, 0, 0);
        const start = new Date(trip.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(trip.endDate);
        end.setHours(0, 0, 0, 0);
        return checkDate >= start && checkDate <= end;
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const calendarDays = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} style={{ borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '100px' }}></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dailyTrips = trips.filter(trip => isDateInTrip(day, trip));

            calendarDays.push(
                <div key={day} style={{
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    padding: '0.5rem',
                    minHeight: '100px',
                    position: 'relative',
                    background: dailyTrips.length > 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: dailyTrips.length > 0 ? 'bold' : 'normal' }}>{day}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                        {dailyTrips.map((trip, idx) => (
                            <div
                                key={trip.id}
                                onClick={() => navigate(`/trips/${trip.id}`)}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: `rgba(${idx % 2 === 0 ? '14, 165, 233' : '139, 92, 246'}, 0.2)`,
                                    borderLeft: `3px solid ${idx % 2 === 0 ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}`,
                                    fontSize: '0.75rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={trip.name}
                            >
                                {trip.name}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return calendarDays;
    };

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CalendarIcon /> Trip Calendar
                </h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
                    <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><ChevronLeft /></button>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', width: '180px', textAlign: 'center' }}>
                        {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><ChevronRight /></button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Days Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--color-border)' }}>
                    {days.map(day => (
                        <div key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: 'var(--color-text-muted)' }}>{day}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '500px' }}>
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
