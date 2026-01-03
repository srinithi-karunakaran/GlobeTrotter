import React from 'react';
import { Search, Filter, MessageCircle, Heart, Share2 } from 'lucide-react';

// Mock Community Data
const communityPosts = [
    { id: 1, user: 'Spectacular Dinosaur', avatar: 'SD', trip: 'Hidden Gems of Bali', likes: 124, comments: 12, image: 'https://images.unsplash.com/photo-1537996194471-e657df9756a6?auto=format&fit=crop&q=80' },
    { id: 2, user: 'Brave Goldfish', avatar: 'BG', trip: 'Swiss Alps Hiking', likes: 89, comments: 5, image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&q=80' },
    { id: 3, user: 'Marshal AM 21EC', avatar: 'MA', trip: 'Roadtrip Across USA', likes: 342, comments: 45, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80' },
    { id: 4, user: 'Victorious Jaguar', avatar: 'VJ', trip: 'Kyoto Cherry Blossoms', likes: 210, comments: 23, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80' },
];

const Community = () => {
    return (
        <div className="container fade-in">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Community Hub</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Share your journey, inspire others.</p>

            {/* Filter Bar logic similar to Screen 10 */}
            <div className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input type="text" placeholder="Search trips, activities..." style={{ paddingLeft: '2.75rem', margin: 0, background: 'rgba(0,0,0,0.3)' }} />
                </div>
                <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
                <button className="btn btn-secondary">Sort by...</button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {communityPosts.map(post => (
                    <div key={post.id} className="card slide-up-hover" style={{ display: 'flex', gap: '1.5rem', padding: '0', overflow: 'hidden' }}>
                        <div style={{ width: '250px', background: `url(${post.image}) center/cover` }} className="bg-img" />

                        <div style={{ padding: '1.5rem 1.5rem 1.5rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{post.avatar}</div>
                                <span style={{ color: 'var(--color-accent-primary)', fontWeight: '600' }}>{post.user}</span>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{post.trip}</h2>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', flex: 1 }}>
                                An amazing 7-day journey exploring the hidden waterfalls and ancient temples. Highly recommended for solo travelers looking for adventure.
                            </p>

                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}><Heart size={18} /> {post.likes}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}><MessageCircle size={18} /> {post.comments}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginLeft: 'auto' }}><Share2 size={18} /> Share</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
