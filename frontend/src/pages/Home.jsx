import React from 'react';
import { Link } from 'react-router-dom';

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechNova',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $150k',
    tags: ['React', 'TypeScript', 'Tailwind']
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Creative Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90k - $120k',
    tags: ['Figma', 'UI/UX', 'Wireframing']
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'DataFlow Inc',
    location: 'San Francisco, CA',
    type: 'Contract',
    salary: '$80/hr - $100/hr',
    tags: ['Node.js', 'PostgreSQL', 'AWS']
  }
];

const Home = () => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <div className="container flex flex-col items-center justify-center text-center animate-fade-in" style={{ minHeight: 'calc(100vh - 150px)', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '800px', marginTop: '4rem' }}>
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

      {/* Featured Jobs Section */}
      <div style={{ padding: '6rem 0', background: 'rgba(15, 23, 42, 0.02)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Opportunities</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Explore some of the most sought-after roles currently available.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {featuredJobs.map(job => (
              <div key={job.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'var(--transition-smooth)' }}
                   onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,99,235,0.1)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}
              >
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                  <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{job.company}</p>
                </div>
                
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="flex items-center gap-2"><span>📍</span> {job.location}</div>
                  <div className="flex items-center gap-2"><span>💼</span> {job.type}</div>
                  <div className="flex items-center gap-2"><span>💰</span> {job.salary}</div>
                </div>
                
                <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                  {job.tags.map(tag => (
                    <span key={tag} style={{ padding: '0.25rem 0.75rem', background: 'rgba(15, 23, 42, 0.05)', borderRadius: '99px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/candidate/search" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
              View All Open Positions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
