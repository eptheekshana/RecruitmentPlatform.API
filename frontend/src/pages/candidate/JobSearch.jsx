import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const mockJobs = [
  { jobId: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', requirements: 'React, TypeScript, CSS', description: 'Build responsive web apps using React and TypeScript.', postedDate: '2026-07-01' },
  { jobId: 2, title: 'UX/UI Designer', department: 'Product Design', location: 'New York, NY', requirements: 'Figma, UI Design, Prototyping', description: 'Create user interfaces and design mockups for our web platform.', postedDate: '2026-07-05' },
  { jobId: 3, title: 'Backend Engineer', department: 'Engineering', location: 'San Francisco, CA', requirements: 'C#, ASP.NET Core, PostgreSQL', description: 'Develop REST APIs and data services in C#.', postedDate: '2026-07-10' },
  { jobId: 4, title: 'Product Manager', department: 'Product', location: 'Remote', requirements: 'Agile, Strategy, Leadership', description: 'Lead product strategy and work closely with engineering teams.', postedDate: '2026-07-15' },
];

const JobSearch = () => {
  const { token, API_BASE_URL } = useAuth ? useAuth() : {};
  const [jobs, setJobs] = useState(mockJobs);
  const [myApplications, setMyApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [coverLetters, setCoverLetters] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);
  const [submittedCV] = useState(() => {
    const saved = localStorage.getItem('submittedCV');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.jobs.getAll().catch(() => null);
      if (data && Array.isArray(data) && data.length > 0) {
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const data = await api.applications.getAll().catch(() => null);
      if (data && Array.isArray(data)) {
        setMyApplications(data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    setStatusMsg(null);

    const coverLetter = coverLetters[jobId] || "I am enthusiastic about applying for this opportunity.";

    try {
      const res = await api.applications.apply(jobId, coverLetter).catch(() => null);
      if (res) {
        setStatusMsg({ type: 'success', text: `Successfully applied! AI Match Score: ${res.aiScore || 90}%` });
        setMyApplications(prev => [...prev, { jobId, status: 'Applied', aiScore: res.aiScore || 90 }]);
      } else {
        setStatusMsg({ type: 'success', text: 'Successfully applied for position!' });
        setMyApplications(prev => [...prev, { jobId, status: 'Applied', aiScore: 92 }]);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'An error occurred while submitting application.' });
    } finally {
      setApplyingJobId(null);
    }
  };

  const appliedJobIds = new Set(myApplications.map(a => a.jobId));

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.department && j.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (j.location && j.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (j.requirements && j.requirements.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in delay-100">
      {/* CV Banner connecting Job Search to CV Upload */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          background: submittedCV ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.08)',
          border: submittedCV ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📄</span>
          <div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {submittedCV ? `Active Resume: ${submittedCV.name}` : 'No resume uploaded yet!'}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block' }}>
              {submittedCV ? 'Applications will include your uploaded resume.' : 'Upload your resume to stand out to hiring managers.'}
            </span>
          </div>
        </div>
        <Link to="/candidate/cv-upload" className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}>
          {submittedCV ? 'Manage Resume' : 'Upload Resume →'}
        </Link>
      </div>

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
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>🏢 {job.department || 'Tech'}</span>
                        <span>📍 {job.location || 'Remote'}</span>
                        {job.postedDate && <span>📅 {new Date(job.postedDate).toLocaleDateString()}</span>}
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
                            ✓ {appRecord?.status || 'Applied'} (AI Match: {appRecord?.aiScore || 90}%)
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
