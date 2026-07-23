import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ShortlistedCandidates = () => {
  const { token, API_BASE_URL } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [candProfile, setCandProfile] = useState(null);
  const [candInterview, setCandInterview] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state
  const [score, setScore] = useState(7);
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('Recommended');

  useEffect(() => {
    fetchRequiredData();
  }, []);

  const fetchRequiredData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const appRes = await fetch(`${API_BASE_URL}/application`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let apps = [];
      if (appRes.ok) {
        apps = await appRes.json();
      }

      const filteredApps = apps.filter(a => 
        ['Shortlisted', 'Interviewing', 'Accepted', 'Rejected', 'Evaluated'].includes(a.status)
      );
      setCandidates(filteredApps);

      const intRes = await fetch(`${API_BASE_URL}/interview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (intRes.ok) {
        const ints = await intRes.json();
        setInterviews(ints);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplicant = async (app) => {
    setSelectedApp(app);
    setCandProfile(null);
    setCandInterview(null);
    setScore(7);
    setComments('');
    setRecommendation('Recommended');

    const matchInt = interviews.find(i => i.applicationId === app.applicationId);
    setCandInterview(matchInt);

    try {
      const res = await fetch(`${API_BASE_URL}/candidate/${app.candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const profile = await res.json();
        setCandProfile(profile);
      }
    } catch (err) {
      console.error('Error fetching candidate profile:', err);
    }
  };

  const handlePostEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedApp || !token) return;

    setEvaluating(true);
    setToast(null);

    try {
      const res = await fetch(`${API_BASE_URL}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: selectedApp.applicationId,
          score: parseInt(score),
          comments: comments.trim(),
          recommendation: recommendation
        })
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ type: 'success', message: 'Evaluation submitted successfully!' });
        setSelectedApp(null);
        fetchRequiredData();
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to submit evaluation.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setEvaluating(false);
    }
  };

  const getStatusClass = (status) => {
    const st = (status || '').toLowerCase();
    if (st === 'shortlisted' || st === 'accepted' || st === 'recommended') return 'shortlisted';
    if (st === 'rejected') return 'rejected';
    return 'applied';
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%' }} className="fade-in">
      {toast && (
        <div 
          className={`alert-box ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 110, maxWidth: '350px', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{toast.message}</div>
          <button style={{ background: 'none', border: 'none', marginLeft: 'auto', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* Header Info */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          Evaluate Shortlisted Candidates
        </h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>
          Review candidate profiles, check active interviews, and submit scorecard recommendations.
        </p>
      </div>

      {/* Grid of Candidates */}
      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-sub)' }}>Loading candidates...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {candidates.length > 0 ? (
            candidates.map(app => {
              const isSelected = selectedApp?.applicationId === app.applicationId;
              return (
                <div
                  key={app.applicationId}
                  className="linkedin-card"
                  onClick={() => handleSelectApplicant(app)}
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    margin: 0,
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
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
                    <span style={{ color: 'var(--text-sub)' }}>App ID: #{app.applicationId}</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>AI Score: {app.aiScore}%</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="linkedin-card text-center" style={{ gridColumn: '1 / -1', padding: '3rem', margin: 0 }}>
              <p style={{ color: 'var(--text-sub)' }}>No shortlisted candidates currently awaiting scorecard feedback.</p>
            </div>
          )}
        </div>
      )}

      {/* Candidate Scorecard Drawer */}
      {selectedApp && (
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
                  {selectedApp.candidateName[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {selectedApp.candidateName}
                  </h2>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-sub)' }}>
                    {selectedApp.candidateEmail}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '1.5rem', cursor: 'pointer', outline: 'none' }}
                aria-label="Close Candidate Scorecard"
              >
                ×
              </button>
            </div>

            {/* Position details */}
            <div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Applying for: <strong style={{ color: 'var(--primary)' }}>{selectedApp.jobTitle}</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="status-badge applied">
                  🤖 AI Score: {selectedApp.aiScore}%
                </span>
                {candProfile?.experienceLevel && (
                  <span className="linkedin-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                    👔 {candProfile.experienceLevel} Level
                  </span>
                )}
              </div>
            </div>

            {/* Profile Brief Info */}
            {candProfile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--border-subtle)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                {candProfile.bio && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                      Candidate Bio
                    </h4>
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {candProfile.bio}
                    </p>
                  </div>
                )}
                {candProfile.skills && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                      Skills
                    </h4>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {candProfile.skills.split(',').map((s, idx) => (
                        <span key={idx} className="linkedin-pill" style={{ fontSize: '0.725rem', padding: '1px 6px', background: 'var(--bg-card)' }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Active Interview details */}
            {candInterview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--primary-light)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--primary)' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', margin: 0, fontWeight: 700, letterSpacing: '0.5px' }}>
                  📅 Active Scheduled Session
                </h4>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div><strong>Type:</strong> {candInterview.interviewType || 'Interview'}</div>
                  <div><strong>Time:</strong> {new Date(candInterview.scheduledDate).toLocaleString()}</div>
                  {candInterview.meetingLink && (
                    <div>
                      <strong>Link:</strong>{' '}
                      <a href={candInterview.meetingLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scorecard evaluation Form */}
            <form 
              onSubmit={handlePostEvaluation} 
              style={{ 
                borderTop: '1px solid var(--border-subtle)', 
                paddingTop: '1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem' 
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Submit Candidate Evaluation
              </h3>

              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Evaluation Rating Score</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{score} / 10</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label className="form-label">Recommendation Decision</label>
                <select 
                  className="form-select" 
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                >
                  <option value="Recommended">Recommend (Accept Candidate)</option>
                  <option value="Interview">Hold for Next Stage</option>
                  <option value="Rejected">Reject Candidate</option>
                </select>
              </div>

              <div>
                <label className="form-label">Evaluation Comments / Notes</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Feedback notes on candidate performance, coding, communications..."
                  required
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-linkedin-primary" 
                disabled={evaluating} 
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.55rem' }}
              >
                {evaluating ? 'Submitting scorecard...' : 'Submit Evaluation Scorecard'}
              </button>
            </form>
          </div>
          {/* Overlay backdrop */}
          <div 
            onClick={() => setSelectedApp(null)} 
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 90 }} 
          />
        </>
      )}
    </div>
  );
};

export default ShortlistedCandidates;
