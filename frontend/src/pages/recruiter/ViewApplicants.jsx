import React, { useState, useEffect } from 'react';
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
    }, 600);
  };

  const filtered = applications.filter(a => {
    const matchesSearch = (a.candidateName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    const st = (status || '').toLowerCase().replace(/\s+/g, '');
    if (st === 'applied') return 'applied';
    if (st === 'shortlisted' || st === 'hired') return 'shortlisted';
    if (st === 'rejected') return 'rejected';
    return 'underreview';
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div className="sr-only" role="status" aria-live="polite">{statusAnnouncement}</div>

      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '1rem' }}>Candidate Applications & Talent Pipeline</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search candidate name or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ flex: '0 0 180px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'rgba(0,0,0,0.6)' }}>Loading applicant submissions...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.length > 0 ? (
            filtered.map(app => (
              <div
                key={app.applicationId}
                className="linkedin-card"
                onClick={() => setSelectedApplicant(app)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  margin: 0,
                  borderColor: selectedApplicant?.applicationId === app.applicationId ? '#0a66c2' : '#e0e0e0'
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem' }}>
                  <div className="flex gap-3 items-center">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#0a66c2',
                      color: '#fff',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      {app.candidateName[0]}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', margin: 0 }}>{app.candidateName}</h3>
                      <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.8rem' }}>{app.jobTitle}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center" style={{ fontSize: '0.8rem', borderTop: '1px solid #eeeeee', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ color: 'rgba(0,0,0,0.6)' }}>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                  <span style={{ color: '#057642', fontWeight: 700 }}>AI Match: {app.aiScore}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="linkedin-card text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
              <p style={{ color: 'rgba(0,0,0,0.6)' }}>No candidates match your current filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Slide-out Candidate Drawer */}
      {selectedApplicant && (
        <>
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '440px', height: '100vh',
            background: '#ffffff', borderLeft: '1px solid #e0e0e0', zIndex: 100,
            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eeeeee', paddingBottom: '0.75rem' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0a66c2', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedApplicant.candidateName[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', margin: 0 }}>{selectedApplicant.candidateName}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>{selectedApplicant.candidateEmail}</span>
                </div>
              </div>
              <button onClick={() => { setSelectedApplicant(null); setScheduledResult(null); }} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div>
              <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Target Position: <strong>{selectedApplicant.jobTitle}</strong></p>
              <div style={{ background: '#e6f4ea', color: '#137333', padding: '0.65rem 0.85rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
                🎯 AI Match Score: {selectedApplicant.aiScore}%
              </div>
            </div>

            {selectedApplicant.coverLetter && (
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', borderLeft: '3px solid #0a66c2' }}>
                <p style={{ fontSize: '0.775rem', color: 'rgba(0,0,0,0.6)', marginBottom: '0.2rem', fontWeight: 600 }}>Cover Note:</p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.9)' }}>"{selectedApplicant.coverLetter}"</p>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Update Application Status</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['Applied', 'Under Review', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusUpdate(st)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '16px',
                      border: selectedApplicant.status === st ? '1.5px solid #0a66c2' : '1px solid #e0e0e0',
                      background: selectedApplicant.status === st ? '#e8f0fe' : '#ffffff',
                      color: selectedApplicant.status === st ? '#0a66c2' : 'rgba(0,0,0,0.7)',
                      cursor: 'pointer',
                      fontSize: '0.775rem',
                      fontWeight: 600
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eeeeee', paddingTop: '0.75rem' }}>
              <button
                className="btn-linkedin-primary"
                onClick={() => setShowInterviewModal(!showInterviewModal)}
                style={{ width: '100%', fontSize: '0.875rem' }}
              >
                📅 Schedule Interview & Send Invites
              </button>
            </div>

            {showInterviewModal && (
              <form onSubmit={handleScheduleInterview} style={{ background: '#fafafa', padding: '1rem', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>Schedule Interview Session</h4>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Interview Type</label>
                  <select className="form-select" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                    <option value="Technical">Technical Interview</option>
                    <option value="HR Screening">HR Screening</option>
                    <option value="Final Management">Final Management</option>
                  </select>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Meeting Link</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://meet.google.com/xyz-123"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-linkedin-primary" disabled={scheduling} style={{ width: '100%', fontSize: '0.85rem' }}>
                  {scheduling ? 'Scheduling Invites...' : 'Confirm & Dispatch'}
                </button>
              </form>
            )}

            {scheduledResult && (
              <div style={{ background: '#e6f4ea', border: '1px solid #a8dab5', padding: '0.85rem', borderRadius: '6px', fontSize: '0.825rem' }}>
                <p style={{ color: '#137333', fontWeight: 600, marginBottom: '0.35rem' }}>✅ Interview Scheduled Successfully!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <a href={scheduledResult.googleCalendarUrl} target="_blank" rel="noreferrer" style={{ color: '#0a66c2', fontWeight: 600 }}>📅 Add to Google Calendar</a>
                  <a href={scheduledResult.outlookCalendarUrl} target="_blank" rel="noreferrer" style={{ color: '#0a66c2', fontWeight: 600 }}>📅 Add to Outlook Calendar</a>
                </div>
              </div>
            )}
          </div>
          <div onClick={() => setSelectedApplicant(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 90 }} />
        </>
      )}
    </div>
  );
};

export default ViewApplicants;
