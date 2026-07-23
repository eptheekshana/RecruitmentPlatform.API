import React from 'react';
import { Link } from 'react-router-dom';

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechNova Solutions',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
    salary: '$120k - $150k • Equity',
    tags: ['React', 'TypeScript', 'CSS/HTML']
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Creative Edge',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    salary: '$95k - $125k',
    tags: ['Figma', 'UI/UX', 'Design Systems']
  },
  {
    id: 3,
    title: 'Backend Engineer (.NET / C#)',
    company: 'Enterprise DataFlow',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$130k - $160k',
    tags: ['C#', '.NET Core', 'SQL Server']
  }
];

const Home = () => {
  return (
    <div style={{ paddingBottom: '5rem' }} className="fade-in">
      <div className="container" style={{ maxWidth: '1128px' }}>
        
        {/* Modern SaaS Hero Welcome Banner */}
        <div
          className="linkedin-card"
          style={{
            padding: '3.5rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--border-subtle) 100%)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Radial Ambient Glow */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '600px', zIndex: 1 }}>
            <h1 style={{ fontSize: '2.65rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              Your Next Professional <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Breakthrough</span> Starts Here
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-sub)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Connect with leading technology companies, manage your talent pipelines effortlessly, and discover opportunities matching your exact skills.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="btn-linkedin-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
                Get Started
              </Link>
              <Link to="/login" className="btn-linkedin-outline" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
                Sign In
              </Link>
            </div>
          </div>

          {/* Side stats card deck */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '280px', flexShrink: 0, zIndex: 1 }}>
            <div className="linkedin-card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>10,000+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                Active Job Postings
              </div>
            </div>
            <div className="linkedin-card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>50,000+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                Verified Candidates
              </div>
            </div>
          </div>
        </div>

        {/* Featured Opportunities Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>Featured Opportunities</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-sub)', marginTop: '2px' }}>Top active postings from recruiters in your network</p>
            </div>
            <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 700 }}>See all jobs →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {featuredJobs.map((job) => (
              <div 
                key={job.id} 
                className="linkedin-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem', 
                  margin: 0, 
                  padding: '1.5rem',
                  borderRadius: '12px'
                }}
              >
                <div className="flex gap-3.5 items-start">
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {job.company[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {job.title}
                    </h3>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', marginTop: '2px' }}>
                      {job.company}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                      📍 {job.location} • 💼 {job.type}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                  💰 {job.salary}
                </div>

                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {job.tags.map((tag) => (
                    <span key={tag} className="linkedin-pill" style={{ fontSize: '0.725rem', padding: '2px 8px', background: 'var(--border-subtle)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link to="/candidate/jobs" className="btn-linkedin-outline" style={{ width: '100%', padding: '0.45rem', fontSize: '0.825rem' }}>
                    View Job details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
