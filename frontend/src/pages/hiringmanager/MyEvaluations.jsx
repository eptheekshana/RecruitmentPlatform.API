import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MyEvaluations = () => {
  const { token, API_BASE_URL } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    if (!token) return;
    try {
      // 1. Fetch evaluations
      const evalRes = await fetch(`${API_BASE_URL}/evaluation/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let evalData = [];
      if (evalRes.ok) {
        evalData = await evalRes.json();
      }

      // 2. Fetch applications to link candidate names & jobs mapping
      const appRes = await fetch(`${API_BASE_URL}/application`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let appData = [];
      if (appRes.ok) {
        appData = await appRes.json();
      }
      setApplications(appData);

      // Map application information into evaluations
      const mappedEvals = evalData.map(ev => {
        const app = appData.find(a => a.applicationId === ev.applicationId);
        return {
          ...ev,
          candidateName: app ? app.candidateName : 'Candidate',
          candidateEmail: app ? app.candidateEmail : '',
          jobTitle: app ? app.jobTitle : `Job ID #${app?.jobId || ev.applicationId}`
        };
      });

      setEvaluations(mappedEvals);
    } catch (err) {
      console.error('Error fetching evaluations history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in delay-100">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>My Evaluations History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review past candidate ratings and scorecard remarks submitted by you</p>
      </div>

      {loading ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading scorecard history...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {evaluations.length > 0 ? (
            evaluations.map(ev => (
              <div
                key={ev.evaluationId}
                className="glass-panel"
                style={{ padding: '2rem', borderLeft: `4px solid ${ev.recommendation === 'Recommended' || ev.recommendation === 'Accepted' ? '#10b981' : ev.recommendation === 'Rejected' ? '#ef4444' : '#38bdf8'}` }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{ev.candidateName}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Position: <strong>{ev.jobTitle}</strong></p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span style={{
                      background: ev.recommendation === 'Recommended' || ev.recommendation === 'Accepted' ? 'rgba(16, 185, 129, 0.15)' :
                                  ev.recommendation === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' :
                                  'rgba(56, 189, 248, 0.15)',
                      color: ev.recommendation === 'Recommended' || ev.recommendation === 'Accepted' ? '#10b981' :
                             ev.recommendation === 'Rejected' ? '#ef4444' :
                             '#38bdf8',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {ev.recommendation}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Evaluated: {new Date(ev.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Scorecard Rubric:</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>Rating: {ev.score} / 10</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                    "{ev.comments}"
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel text-center" style={{ padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>You haven't submitted any candidate evaluations yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvaluations;
