import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex justify-between items-center">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>R</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem' }}>Recruit<span className="text-gradient">Hub</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" style={{ color: location.pathname === '/' ? 'white' : 'var(--text-secondary)', fontWeight: 500, transition: 'var(--transition-smooth)' }}>Home</Link>
          <Link to="/login" className="btn btn-secondary">Log In</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
