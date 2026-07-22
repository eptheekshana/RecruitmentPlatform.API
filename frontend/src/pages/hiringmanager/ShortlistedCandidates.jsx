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
      // 1. Fetch applications
      const appRes = await fetch(`${API_BASE_URL}/application`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let apps = [];
      if (appRes.ok) {
        apps = await appRes.json();
      }

      // Filter: only show applications that are Shortlisted, Interviewing, Hired, or Rejected
      const filteredApps = apps.filter(a => 
        ['Shortlisted', 'Interviewing', 'Accepted', 'Rejected', 'Evaluated'].includes(a.status)
      );
      setCandidates(filteredApps);

      // 2. Fetch interviews
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

    // Find scheduled interview matching this application
    const matchInt = interviews.find(i => i.applicationId === app.applicationId);
    setCandInterview(matchInt);

    // Fetch candidate profile for skills & experience
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

  return (
    <div style={{ position: 'relative', minHeight: '100%' }} className="animate-fade-in delay-100">
      
      {toast && (
        <div 
          className={`alert-box ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 110, maxWidth: '350px' }}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{toast.message}</div>
          <button style={{ background: 'none', border: 'none', marginLeft: 'auto', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Evaluate Candidates</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review candidate portfolios and submit structured scorecards</p>
      </div>

      {loading ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading candidate queues...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {candidates.length > 0 ? (
            candidates.map(app => (
              <div
                key={app.applicationId}
                className="glass-panel"
                onClick={() => handleSelectApplicant(app)}
                style={{
                  padding: '2rem',
                  cursor: 'pointer',
                  borderColor: selectedApp?.applicationId === app.applicationId ? '#10b981' : 'var(--glass-border)',
                  transform: selectedApp?.applicationId === app.applicationId ? 'translateY(-2px)' : 'none',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>{app.candidateName}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{app.jobTitle}</p>
                  </div>
                  <span style={{
                    background: app.status === 'Accepted' || app.status === 'Recommended' ? 'rgba(16, 185, 129, 0.15)' :
                                app.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' :
                                'rgba(56, 189, 248, 0.15)',
                    color: app.status === 'Accepted' || app.status === 'Recommended' ? '#10b981' :
                           app.status === 'Rejected' ? '#ef4444' :
                           '#38bdf8',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {app.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center" style={{ fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Job ID: #{app.jobId}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>AI Overlap: {app.aiScore}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No applications are currently awaiting evaluation.</p>
            </div>
          )}
        </div>
      )}

      {/* Candidate Scorecard Drawer */}
      {selectedApp && (
        <>
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '500px', height: '100vh',
            background: '#111827', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 100,
            padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedApp.candidateName}</h2>
                <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{selectedApp.candidateEmail}</span>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.75rem', cursor: 'pointer' }}>×</button>
            </div>

            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Job Posting: <strong>{selectedApp.jobTitle}</strong></p>
              <div className="flex gap-2" style={{ marginTop: '0.5rem' }}>
                <span style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                  🤖 AI Match: {selectedApp.aiScore}%
                </span>
                {candProfile?.experienceLevel && (
                  <span style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    👔 {candProfile.experienceLevel} Level
                  </span>
                )}
              </div>
            </div>

            {candProfile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {candProfile.bio && (
                  <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Candidate Bio</h4>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>{candProfile.bio}</p>
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Skills</h4>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {candProfile.skills.split(',').map((s, idx) => (
                      <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                {candProfile.resumeUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href={candProfile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary text-center" style={{ width: '100%', display: 'inline-block', padding: '0.5rem' }}>
                      📄 View Candidate CV / Resume File
                    </a>
                  </div>
                )}
              </div>
            )}

            {candInterview && (
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <p style={{ color: '#38bdf8', fontWeight: 600, margin: '0 0 0.5rem 0' }}>📅 Scheduled Interview</p>
                <p style={{ margin: '0 0 0.25rem 0' }}><strong>Type:</strong> {candInterview.interviewType}</p>
                <p style={{ margin: '0 0 0.25rem 0' }}><strong>Time:</strong> {new Date(candInterview.scheduledTime).toLocaleString()}</p>
                <a href={candInterview.meetingLink} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'underline' }}>Join Meeting Link</a>
              </div>
            )}

            {/* Scorecard form */}
            <form onSubmit={handlePostEvaluation} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Candidate Scorecard</h3>

              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Evaluation Score rating</span>
                  <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>{score} / 10</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', marginTop: '0.5rem' }}
                />
              </div>

              <div>
                <label className="form-label">Hiring Decision Recommendation</label>
                <select 
                  className="form-input" 
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  style={{ marginTop: '0.5rem' }}
                >
                  <option value="Recommended">Recommend (Accept Candidate)</option>
                  <option value="Interview">Hold for Next Interview Stage</option>
                  <option value="Rejected">Reject Candidate</option>
                </select>
              </div>

              <div>
                <label className="form-label">Feedback Notes / Comments</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide detailed feedback on candidate skills, fitment, and qualifications..."
                  required
                  style={{ marginTop: '0.5rem', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={evaluating} style={{ background: '#10b981', borderColor: '#10b981', padding: '1rem', width: '100%', marginTop: '0.5rem' }}>
                {evaluating ? 'Submitting Scorecard...' : 'Submit Scorecard & Decision'}
              </button>
            </form>
          </div>
          <div onClick={() => setSelectedApp(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 90 }} />
        </>
      )}
    </div>
  );
};

export default ShortlistedCandidates;
