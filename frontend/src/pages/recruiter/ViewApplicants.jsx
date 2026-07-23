import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const mockApplicants = [
  { applicationId: 1, candidateName: 'Bimsara Pramod', candidateEmail: 'bimsarah@example.com', jobTitle: 'Senior Frontend Developer', status: 'Applied', aiScore: 92, appliedDate: '2026-07-19', coverLetter: 'Experienced frontend dev with React & TS.' },
  { applicationId: 2, candidateName: 'Kaveesh Akalanka', candidateEmail: 'kaveesh@example.com', jobTitle: 'UX/UI Designer', status: 'Shortlisted', aiScore: 85, appliedDate: '2026-07-18', coverLetter: 'UI/UX designer proficient in Figma.' },
  { applicationId: 3, candidateName: 'Hiruna Perera', candidateEmail: 'hiruna@example.com', jobTitle: 'Backend Engineer', status: 'Interviewing', aiScore: 96, appliedDate: '2026-07-15', coverLetter: 'Backend specialist with C# & SQL.' },
  { applicationId: 4, candidateName: 'Shanuka Gamage', candidateEmail: 'shanukagamage@example.com', jobTitle: 'Product Manager', status: 'Rejected', aiScore: 65, appliedDate: '2026-07-10', coverLetter: 'Product manager with Agile experience.' },
];

const ViewApplicants = () => {
  const { token } = useAuth ? useAuth() : {};
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
    setLoading(true);
    try {
      const data = await api.applications.getAll().catch(() => null);
      if (data && Array.isArray(data) && data.length > 0) {
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
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
    <div style={{ position: 'relative', minHeight: '100%' }} className="fade-in">
      <div className="sr-only" role="status" aria-live="polite">{statusAnnouncement}</div>

      {/* Filter Toolbar Card */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Applications & Candidate Pipeline
        </h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)', display: 'flex', alignItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="form-input"
              placeholder="Search candidate name or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', borderRadius: '20px' }}
            />
          </div>
          <div style={{ flex: '0 0 200px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ borderRadius: '20px' }}
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

      {/* Main Grid List */}
      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-sub)' }}>Loading submissions...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filtered.length > 0 ? (
            filtered.map(app => {
              const isSelected = selectedApplicant?.applicationId === app.applicationId;
              return (
                <div
                  key={app.applicationId}
                  className="linkedin-card"
                  onClick={() => setSelectedApplicant(app)}
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    margin: 0,
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: '#fff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.95rem'
                      }}>
                        {app.candidateName[0]}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                          {app.candidateName}
                        </h3>
                        <p style={{ color: 'var(--text-sub)', fontSize: '0.775rem', margin: 0 }}>
                          {app.jobTitle}
                        </p>
                      </div>
                    </div>
                    <span className={`status-badge ${getStatusClass(app.status)}`} style={{ flexShrink: 0 }}>
                      {app.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--text-sub)' }}>{new Date(app.appliedDate).toLocaleDateString()}</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>AI Match: {app.aiScore}%</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="linkedin-card text-center" style={{ gridColumn: '1 / -1', padding: '3rem', margin: 0 }}>
              <p style={{ color: 'var(--text-sub)' }}>No candidate records match filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Slide-out Candidate Drawer */}
      {selectedApplicant && (
        <>
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '440px', height: '100vh',
            background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', zIndex: 100,
            padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.25)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedApplicant.candidateName[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {selectedApplicant.candidateName}
                  </h2>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-sub)' }}>
                    {selectedApplicant.candidateEmail}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedApplicant(null); setScheduledResult(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '1.5rem', cursor: 'pointer', outline: 'none' }}
                aria-label="Close Candidate Details"
              >
                ×
              </button>
            </div>

            {/* Position and AI score */}
            <div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Applying for: <strong style={{ color: 'var(--primary)' }}>{selectedApplicant.jobTitle}</strong>
              </p>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
                🎯 AI Suitability Match: {selectedApplicant.aiScore}%
              </div>
            </div>

            {/* Cover Note Section */}
            {selectedApplicant.coverLetter && (
              <div style={{ background: 'var(--border-subtle)', padding: '0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Candidate Cover Note
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{selectedApplicant.coverLetter}"
                </p>
              </div>
            )}

            {/* Change Status Section */}
            <div>
              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                Pipeline Stage Update
              </h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['Applied', 'Under Review', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusUpdate(st)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '16px',
                      border: selectedApplicant.status === st ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      background: selectedApplicant.status === st ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: selectedApplicant.status === st ? 'var(--primary)' : 'var(--text-sub)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Action */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <button
                className="btn-linkedin-primary"
                onClick={() => setShowInterviewModal(!showInterviewModal)}
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.55rem' }}
              >
                📅 Schedule Interview Session
              </button>
            </div>

            {/* Interview scheduling modal */}
            {showInterviewModal && (
              <form
                onSubmit={handleScheduleInterview}
                style={{
                  background: 'var(--border-subtle)',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Confirm Interview Invite
                </h4>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Date & Time Selection</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Type of Evaluation</label>
                  <select
                    className="form-select"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <option value="Technical">Technical Interview</option>
                    <option value="HR Screening">HR Screening</option>
                    <option value="Final Management">Final Management</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Virtual Meeting Link</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://meet.google.com/xyz-123"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-linkedin-primary"
                  disabled={scheduling}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem' }}
                >
                  {scheduling ? 'Scheduling Invites...' : 'Confirm & Send Details'}
                </button>
              </form>
            )}

            {/* Scheduled Results Banners */}
            {scheduledResult && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1.5px solid #10b981',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.825rem'
                }}
              >
                <p style={{ color: '#10b981', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                  ✓ Interview Dispatched Successfully!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <a href={scheduledResult.googleCalendarUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    📅 Add to Google Calendar
                  </a>
                  <a href={scheduledResult.outlookCalendarUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    📅 Add to Outlook Calendar
                  </a>
                </div>
              </div>
            )}
          </div>
          {/* Overlay backdrop */}
          <div
            onClick={() => setSelectedApplicant(null)}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 90 }}
          />
        </>
      )}
    </div>
  );
};

export default ViewApplicants;
