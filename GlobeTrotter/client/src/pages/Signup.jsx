import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Camera } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        password: '',
        info: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    city: formData.city,
                    country: formData.country
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
            <div className="card fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '800px', border: '1px solid var(--color-border)' }}>

                {/* Photo Circle */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px', height: '100px',
                        borderRadius: '50%',
                        border: '2px dashed var(--color-text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            <Camera size={24} style={{ display: 'block', margin: '0 auto 0.25rem' }} />
                            <span style={{ fontSize: '0.8rem' }}>Photo</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} style={{ width: '100%' }} required />
                        </div>
                        <div>
                            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} style={{ width: '100%' }} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={{ width: '100%' }} required />
                        </div>
                        <div>
                            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={{ width: '100%' }} required />
                    </div>

                    <div>
                        <textarea name="info" placeholder="Additional Information..." rows="3" value={formData.info} onChange={handleChange} style={{ width: '100%' }}></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 3rem' }} disabled={loading}>
                            {loading ? 'Registering...' : 'Register Users'}
                        </button>
                    </div>

                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-accent-primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
