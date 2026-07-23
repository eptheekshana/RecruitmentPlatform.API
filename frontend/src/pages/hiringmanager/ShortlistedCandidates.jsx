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
    <div style={{ position: 'relative', minHeight: '100%' }}>
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

      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.2rem' }}>Evaluate Shortlisted Candidates</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>Review candidate profiles and record interview decision scorecards.</p>
      </div>

      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'rgba(0,0,0,0.6)' }}>Loading candidate queues...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {candidates.length > 0 ? (
            candidates.map(app => (
              <div
                key={app.applicationId}
                className="linkedin-card"
                onClick={() => handleSelectApplicant(app)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  margin: 0,
                  borderColor: selectedApp?.applicationId === app.applicationId ? '#0a66c2' : '#e0e0e0'
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem' }}>
                  <div className="flex gap-3 items-center">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#057642',
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
                  <span style={{ color: 'rgba(0,0,0,0.6)' }}>App ID: #{app.applicationId}</span>
                  <span style={{ color: '#057642', fontWeight: 700 }}>AI Score: {app.aiScore}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="linkedin-card text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
              <p style={{ color: 'rgba(0,0,0,0.6)' }}>No candidates currently awaiting evaluation.</p>
            </div>
          )}
        </div>
      )}

      {/* Candidate Scorecard Drawer */}
      {selectedApp && (
        <>
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '440px', height: '100vh',
            background: '#ffffff', borderLeft: '1px solid #e0e0e0', zIndex: 100,
            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eeeeee', paddingBottom: '0.75rem' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#057642', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedApp.candidateName[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', margin: 0 }}>{selectedApp.candidateName}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>{selectedApp.candidateEmail}</span>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div>
              <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>Target Position: <strong>{selectedApp.jobTitle}</strong></p>
              <div className="flex gap-2" style={{ marginTop: '0.35rem' }}>
                <span className="status-badge applied">
                  🤖 AI Match: {selectedApp.aiScore}%
                </span>
                {candProfile?.experienceLevel && (
                  <span className="linkedin-pill">
                    👔 {candProfile.experienceLevel} Level
                  </span>
                )}
              </div>
            </div>

            {candProfile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#fafafa', padding: '1rem', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                {candProfile.bio && (
                  <div>
                    <h4 style={{ fontSize: '0.775rem', color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>Candidate Bio</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'rgba(0,0,0,0.9)' }}>{candProfile.bio}</p>
                  </div>
                )}
                {candProfile.skills && (
                  <div>
                    <h4 style={{ fontSize: '0.775rem', color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600 }}>Skills</h4>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                      {candProfile.skills.split(',').map((s, idx) => (
                        <span key={idx} className="linkedin-pill">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scorecard form */}
            <form onSubmit={handlePostEvaluation} style={{ borderTop: '1px solid #eeeeee', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', margin: 0 }}>Candidate Scorecard</h3>

              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span>Evaluation Score rating</span>
                  <strong style={{ color: '#057642', fontSize: '1.05rem' }}>{score} / 10</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  style={{ width: '100%', accentColor: '#057642', cursor: 'pointer' }}
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
                <label className="form-label">Evaluation Feedback</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Feedback notes on candidate performance..."
                  required
                />
              </div>

              <button type="submit" className="btn-linkedin-primary" disabled={evaluating} style={{ width: '100%', fontSize: '0.875rem' }}>
                {evaluating ? 'Submitting...' : 'Submit Evaluation Scorecard'}
              </button>
            </form>
          </div>
          <div onClick={() => setSelectedApp(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 90 }} />
        </>
      )}
    </div>
  );
};

export default ShortlistedCandidates;
