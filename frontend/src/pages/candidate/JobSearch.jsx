import React, { useState } from 'react';

const mockJobs = [
  { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Remote', type: 'Full-time', salary: '$120k - $150k', tags: ['React', 'TypeScript', 'CSS'] },
  { id: 2, title: 'UX/UI Designer', company: 'DesignStudio', location: 'New York, NY', type: 'Contract', salary: '$80/hr', tags: ['Figma', 'UI Design', 'Prototyping'] },
  { id: 3, title: 'Backend Engineer', company: 'DataSystems', location: 'San Francisco, CA', type: 'Full-time', salary: '$140k - $170k', tags: ['Node.js', 'PostgreSQL', 'AWS'] },
  { id: 4, title: 'Product Manager', company: 'InnovateInc', location: 'Remote', type: 'Full-time', salary: '$130k - $160k', tags: ['Agile', 'Strategy', 'Leadership'] },
];

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [appliedJobs, setAppliedJobs] = useState({});

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      !locationFilter ||
      (locationFilter === 'remote' && job.location.toLowerCase().includes('remote')) ||
      (locationFilter === 'ny' && job.location.toLowerCase().includes('new york')) ||
      (locationFilter === 'sf' && job.location.toLowerCase().includes('san francisco'));

    return matchesSearch && matchesLocation;
  });

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="animate-fade-in delay-100">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Find Your Next Opportunity</h1>

        <form onSubmit={(e) => e.preventDefault()} role="search">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <label htmlFor="job-search-input" className="sr-only">
                Search jobs by title, company, or skills
              </label>
              <span
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem' }}
                aria-hidden="true"
              >
                🔍
              </span>
              <input
                id="job-search-input"
                type="text"
                className="form-input"
                placeholder="Search by job title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search field"
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ flex: '0 0 200px' }}>
              <label htmlFor="location-filter" className="sr-only">
                Filter by location
              </label>
              <select
                id="location-filter"
                className="form-input"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="ny">New York, NY</option>
                <option value="sf">San Francisco, CA</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', itemsCenter: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }} aria-live="polite" aria-atomic="true">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
        </h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label htmlFor="sort-by-select" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sort by:
          </label>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="relevant">Most Relevant</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isApplied = appliedJobs[job.id];
            return (
              <article
                key={job.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div className="flex justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job.company}</span>
                      <span>
                        <span aria-hidden="true">📍 </span>
                        {job.location}
                      </span>
                      <span>
                        <span aria-hidden="true">💼 </span>
                        {job.type}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{job.salary}</div>
                    <button
                      type="button"
                      className={`btn ${isApplied ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleApply(job.id)}
                      disabled={isApplied}
                      aria-label={isApplied ? `Applied for ${job.title} at ${job.company}` : `Apply for ${job.title} at ${job.company}`}
                      style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
                    >
                      {isApplied ? '✓ Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>

                <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }} aria-label={`Skills required for ${job.title}`}>
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })
        ) : (
          <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }} role="status" aria-live="polite">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
              😕
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No jobs found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
