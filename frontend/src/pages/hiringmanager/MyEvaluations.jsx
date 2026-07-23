import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MyEvaluations = () => {
  const { token, API_BASE_URL } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    if (!token) return;
    try {
      const evalRes = await fetch(`${API_BASE_URL}/evaluation/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let evalData = [];
      if (evalRes.ok) {
        evalData = await evalRes.json();
      }

      const appRes = await fetch(`${API_BASE_URL}/application`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let appData = [];
      if (appRes.ok) {
        appData = await appRes.json();
      }

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

  const getStatusClass = (rec) => {
    const r = (rec || '').toLowerCase();
    if (r === 'recommended' || r === 'accepted') return 'shortlisted';
    if (r === 'rejected') return 'rejected';
    return 'applied';
  };

  const getBorderColor = (recommendation) => {
    const r = (recommendation || '').toLowerCase();
    if (r === 'recommended' || r === 'accepted') return '#10b981'; // Green
    if (r === 'rejected') return '#ef4444'; // Red
    return 'var(--primary)'; // Blue/other
  };

  return (
    <div className="fade-in">
      {/* Header card */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          My Evaluation History
        </h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>
          Review scorecard ratings and decision feedback records submitted by you.
        </p>
      </div>

      {/* List layout */}
      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-sub)' }}>Loading evaluation history...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {evaluations.length > 0 ? (
            evaluations.map(ev => (
              <div
                key={ev.evaluationId}
                className="linkedin-card"
                style={{
                  padding: '1.25rem',
                  margin: 0,
                  borderLeft: `4px solid ${getBorderColor(ev.recommendation)}`
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem', gap: '0.5rem' }}>
                  <div className="flex gap-3 items-center">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {ev.candidateName[0]}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                        {ev.candidateName}
                      </h3>
                      <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem', margin: 0 }}>
                        Target Position: <strong style={{ color: 'var(--primary)' }}>{ev.jobTitle}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1" style={{ flexShrink: 0 }}>
                    <span className={`status-badge ${getStatusClass(ev.recommendation)}`}>
                      {ev.recommendation}
                    </span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-disabled)' }}>
                      Evaluated {new Date(ev.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'var(--border-subtle)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-sub)' }}>Scorecard Rating Rating:</span>
                    <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>{ev.score} / 10</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{ev.comments}"
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
              <p style={{ color: 'var(--text-sub)' }}>No candidate evaluation history recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvaluations;
