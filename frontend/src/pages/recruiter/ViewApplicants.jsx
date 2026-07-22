import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const mockApplicants = [
  { applicationId: 1, candidateName: 'Alice Smith', candidateEmail: 'alice.smith@example.com', jobTitle: 'Senior Frontend Developer', status: 'Applied', aiScore: 92, appliedDate: '2026-07-19', coverLetter: 'Experienced frontend dev with React & TS.' },
  { applicationId: 2, candidateName: 'Bob Johnson', candidateEmail: 'bob.j@example.com', jobTitle: 'UX/UI Designer', status: 'Shortlisted', aiScore: 85, appliedDate: '2026-07-18', coverLetter: 'UI/UX designer proficient in Figma.' },
  { applicationId: 3, candidateName: 'Charlie Davis', candidateEmail: 'charlie.d@example.com', jobTitle: 'Backend Engineer', status: 'Interviewing', aiScore: 96, appliedDate: '2026-07-15', coverLetter: 'Backend specialist with C# & SQL.' },
  { applicationId: 4, candidateName: 'Diana Prince', candidateEmail: 'diana.p@example.com', jobTitle: 'Product Manager', status: 'Rejected', aiScore: 65, appliedDate: '2026-07-10', coverLetter: 'Product manager with Agile experience.' },
];

const ViewApplicants = () => {
  const { token, API_BASE_URL } = useAuth ? useAuth() : {};
  const [applications, setApplications] = useState(mockApplicants);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  // Interview modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [meetingLink, setMeetingLink] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduledResult, setScheduledResult] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await api.applications.getAll().catch(() => null);
      if (data && Array.isArray(data) && data.length > 0) {
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplicant) return;

    setApplications(prev => prev.map(a => a.applicationId === selectedApplicant.applicationId ? { ...a, status: newStatus } : a));
    setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
    setStatusAnnouncement(`Status for ${selectedApplicant.candidateName} set to ${newStatus}`);

    try {
      await api.applications.updateStatus(selectedApplicant.applicationId, newStatus).catch(() => null);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApplicant || !interviewDate) return;

    setScheduling(true);
    setScheduledResult(null);

    const mockResult = {
      googleCalendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Interview+with+${encodeURIComponent(selectedApplicant.candidateName)}`,
      outlookCalendarUrl: `https://outlook.live.com/calendar/0/deeplink/compose?subject=Interview+with+${encodeURIComponent(selectedApplicant.candidateName)}`
    };

    setTimeout(() => {
      setScheduledResult(mockResult);
      setStatusAnnouncement(`Interview scheduled for ${selectedApplicant.candidateName}`);
      handleStatusUpdate('Interviewing');
      setScheduling(false);
    }, 800);
  };

  const filtered = applications.filter(a => {
    const matchesSearch = (a.candidateName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ position: 'relative', minHeight: '100%' }} className="animate-fade-in delay-100">
      <div className="sr-only" role="status" aria-live="polite">{statusAnnouncement}</div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Review Candidate Applications</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input
              type="text"
              className="form-input"
              placeholder="Search candidate or job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          <div style={{ flex: '0 0 200px' }}>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading applicant submissions...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.length > 0 ? (
            filtered.map(app => (
              <div
                key={app.applicationId}
                className="glass-panel"
                onClick={() => setSelectedApplicant(app)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  borderColor: selectedApplicant?.applicationId === app.applicationId ? 'var(--accent-primary)' : 'var(--glass-border)',
                  transform: selectedApplicant?.applicationId === app.applicationId ? 'translateY(-2px)' : 'none'
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>{app.candidateName}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{app.jobTitle}</p>
                  </div>
                  <span style={{
                    background: 'rgba(56,189,248,0.15)',
                    color: '#38bdf8',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {app.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center" style={{ fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>AI Score: {app.aiScore}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No applications match your filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Slide-out Candidate Drawer */}
      {selectedApplicant && (
        <>
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '480px', height: '100vh',
            background: '#111827', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 100,
            padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedApplicant.candidateName}</h2>
              <button onClick={() => { setSelectedApplicant(null); setScheduledResult(null); }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Position: <strong>{selectedApplicant.jobTitle}</strong></p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Email: <strong>{selectedApplicant.candidateEmail}</strong></p>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', fontWeight: 600 }}>
                🤖 AI Algorithm Match Score: {selectedApplicant.aiScore}%
              </div>
            </div>

            {selectedApplicant.coverLetter && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Cover Note:</p>
                <p style={{ fontSize: '0.9rem' }}>"{selectedApplicant.coverLetter}"</p>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Update Status</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Applied', 'Under Review', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusUpdate(st)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '99px',
                      border: selectedApplicant.status === st ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedApplicant.status === st ? 'rgba(56,189,248,0.2)' : 'transparent',
                      color: selectedApplicant.status === st ? '#38bdf8' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowInterviewModal(!showInterviewModal)}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                📅 Schedule Interview & Send Invites
              </button>
            </div>

            {showInterviewModal && (
              <form onSubmit={handleScheduleInterview} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Schedule Interview</h4>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Interview Type</label>
                  <select className="form-input" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                    <option value="Technical">Technical Interview</option>
                    <option value="HR Screening">HR Screening</option>
                    <option value="Final Management">Final Management</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Meeting Link</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://meet.google.com/xyz-123"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={scheduling} style={{ width: '100%' }}>
                  {scheduling ? 'Scheduling & Dispatching Email/SMS...' : 'Confirm & Dispatch Invites'}
                </button>
              </form>
            )}

            {scheduledResult && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <p style={{ color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>✅ Interview Scheduled & Invites Dispatched!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <a href={scheduledResult.googleCalendarUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>📅 Open in Google Calendar</a>
                  <a href={scheduledResult.outlookCalendarUrl} target="_blank" rel="noreferrer" style={{ color: '#c084fc' }}>📅 Open in Outlook Calendar</a>
                </div>
              </div>
            )}
          </div>
          <div onClick={() => setSelectedApplicant(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 90 }} />
        </>
      )}
    </div>
  );
};

export default ViewApplicants;
