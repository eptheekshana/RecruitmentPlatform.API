import React, { useState } from 'react';

const mockJobs = [
  { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Remote', type: 'Full-time', salary: '$120k - $150k', tags: ['React', 'TypeScript', 'CSS'] },
  { id: 2, title: 'UX/UI Designer', company: 'DesignStudio', location: 'New York, NY', type: 'Contract', salary: '$80/hr', tags: ['Figma', 'UI Design', 'Prototyping'] },
  { id: 3, title: 'Backend Engineer', company: 'DataSystems', location: 'San Francisco, CA', type: 'Full-time', salary: '$140k - $170k', tags: ['Node.js', 'PostgreSQL', 'AWS'] },
  { id: 4, title: 'Product Manager', company: 'InnovateInc', location: 'Remote', type: 'Full-time', salary: '$130k - $160k', tags: ['Agile', 'Strategy', 'Leadership'] },
];

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredJobs = mockJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in delay-100">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Find Your Next Opportunity</h2>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem' }}>🔍</span>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by job title, company, or skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          <div style={{ flex: '0 0 200px' }}>
            <select className="form-input" style={{ appearance: 'none', cursor: 'pointer' }}>
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="ny">New York, NY</option>
              <option value="sf">San Francisco, CA</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ padding: '0 2rem' }}>Search</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>{filteredJobs.length} Jobs Found</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
          <select style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontWeight: 600 }}>
            <option value="recent">Most Recent</option>
            <option value="relevant">Most Relevant</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'var(--transition-smooth)' }} 
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              <div className="flex justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job.company}</span>
                    <span>📍 {job.location}</span>
                    <span>💼 {job.type}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{job.salary}</div>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Apply Now</button>
                </div>
              </div>
              
              <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                {job.tags.map(tag => (
                  <span key={tag} style={{ padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '99px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No jobs found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
