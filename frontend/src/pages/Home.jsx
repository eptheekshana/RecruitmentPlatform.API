import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container flex flex-col items-center justify-center text-center animate-fade-in" style={{ minHeight: 'calc(100vh - 150px)' }}>
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Discover the ultimate <br />
          <span className="text-gradient">Recruitment Platform</span>
        </h1>
        <p className="delay-100 animate-fade-in" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Connect with top talent and discover life-changing career opportunities. The intelligent way to build your team and grow your career.
        </p>
        <div className="flex justify-center gap-4 delay-200 animate-fade-in">
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Get Started</Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Sign In</Link>
        </div>
        
        <div className="mt-8 delay-300 animate-fade-in glass-panel" style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-around', padding: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>10k+</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Active Jobs</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>50k+</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Candidates</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>98%</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
