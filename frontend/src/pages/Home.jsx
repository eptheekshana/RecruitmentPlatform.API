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
    <div style={{ paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1128px' }}>
        {/* LinkedIn Classic Hero Welcome Banner */}
        <div
          className="linkedin-card"
          style={{
            padding: '3rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f4f6f8 100%)'
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'rgba(0,0,0,0.9)', fontWeight: 300, lineHeight: 1.2, marginBottom: '1rem' }}>
              Welcome to your <span style={{ color: '#0a66c2', fontWeight: 600 }}>professional recruitment</span> network
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(0,0,0,0.6)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Connect with top companies, manage candidate pipelines, and discover your next major career opportunity.
            </p>
            <div className="flex gap-3">
              <Link to="/register" className="btn-linkedin-primary" style={{ padding: '0.65rem 1.75rem', fontSize: '1rem' }}>
                Join Now
              </Link>
              <Link to="/login" className="btn-linkedin-outline" style={{ padding: '0.65rem 1.75rem', fontSize: '1rem' }}>
                Sign In
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '280px', flexShrink: 0 }}>
            <div className="linkedin-card" style={{ margin: 0, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0a66c2' }}>10,000+</div>
              <div style={{ fontSize: '0.825rem', color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>Active Job Postings</div>
            </div>
            <div className="linkedin-card" style={{ margin: 0, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#004182' }}>50,000+</div>
              <div style={{ fontSize: '0.825rem', color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>Verified Professionals</div>
            </div>
          </div>
        </div>

        {/* Featured Opportunities Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>Recommended Jobs For You</h2>
            <Link to="/login" style={{ fontSize: '0.875rem', color: '#0a66c2', fontWeight: 600 }}>See all jobs →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {featuredJobs.map((job) => (
              <div key={job.id} className="linkedin-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
                <div className="flex gap-3 items-start">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '4px',
                      background: '#0a66c2',
                      color: '#ffffff',
                      fontWeight: 700,
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
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0a66c2', cursor: 'pointer' }}>{job.title}</h3>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(0,0,0,0.9)' }}>{job.company}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>{job.location} • {job.type}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#137333', fontWeight: 600 }}>
                  {job.salary}
                </div>

                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {job.tags.map((tag) => (
                    <span key={tag} className="linkedin-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #eeeeee' }}>
                  <Link to="/candidate/jobs" className="btn-linkedin-outline" style={{ width: '100%', padding: '0.35rem', fontSize: '0.85rem' }}>
                    Easy Apply
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
