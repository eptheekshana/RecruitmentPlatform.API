import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const JobSearch = () => {
  const { token, API_BASE_URL } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [coverLetters, setCoverLetters] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobpostings`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyApplications(data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  const handleApply = async (jobId) => {
    if (!token) return;
    setApplyingJobId(jobId);
    setStatusMsg(null);

    const coverLetter = coverLetters[jobId] || "I am enthusiastic about applying for this opportunity.";

    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobId, coverLetter })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: `Successfully applied! AI Match Score: ${data.aiScore}%` });
        fetchMyApplications();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to submit application.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'An error occurred while submitting application.' });
    } finally {
      setApplyingJobId(null);
    }
  };

  const appliedJobIds = new Set(myApplications.map(a => a.jobId));

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.requirements && j.requirements.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in delay-100">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Find & Apply for Opportunities</h1>

        {statusMsg && (
          <div className={`alert-box ${statusMsg.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.5rem' }}>
            <span>{statusMsg.type === 'error' ? '⚠️' : '✅'}</span>
            <div>{statusMsg.text}</div>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem' }}>🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search by job title, department, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem' }}>{filteredJobs.length} Active Positions</h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your Applications: {myApplications.length}</span>
      </div>

      {loading ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading job postings...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const isApplied = appliedJobIds.has(job.jobId);
              const appRecord = myApplications.find(a => a.jobId === job.jobId);

              return (
                <article key={job.jobId} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="flex justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{job.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', alignItems: 'center', fontSize: '0.9rem' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>🏢 {job.department}</span>
                        <span>📍 {job.location}</span>
                        <span>📅 {new Date(job.postedDate).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div>
                      {isApplied ? (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '99px',
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}>
                            ✓ {appRecord?.status || 'Applied'} (AI Match: {appRecord?.aiScore}%)
                          </span>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleApply(job.jobId)}
                          disabled={applyingJobId === job.jobId}
                          style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                        >
                          {applyingJobId === job.jobId ? 'Submitting...' : 'Apply Now'}
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{job.description}</p>

                  {job.requirements && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)', fontSize: '0.875rem' }}>
                      <strong>Requirements:</strong> {job.requirements}
                    </div>
                  )}

                  {!isApplied && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Optional Cover Letter note..."
                        value={coverLetters[job.jobId] || ''}
                        onChange={(e) => setCoverLetters({ ...coverLetters, [job.jobId]: e.target.value })}
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                      />
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
              <h3>No jobs found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Check back soon for new openings!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
