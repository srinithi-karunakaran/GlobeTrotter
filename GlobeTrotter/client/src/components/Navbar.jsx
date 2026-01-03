import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Users, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user.email) return null; // Don't show nav if not logged in

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(5, 11, 20, 0.8)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))', borderRadius: '8px' }}></div>
                    <span style={{ background: 'linear-gradient(to right, #fff, var(--color-accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        GlobeTrotter
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Compass size={18} /> Explore
                    </NavLink>
                    <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Users size={18} /> Community
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Calendar size={18} /> Calendar
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <User size={18} /> Profile
                    </NavLink>
                </div>

                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
