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
      setApplications(appData);

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

  return (
    <div>
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.2rem' }}>My Evaluation History</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>Review candidate ratings and decision remarks submitted by you.</p>
      </div>

      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'rgba(0,0,0,0.6)' }}>Loading evaluation history...</p>
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
                  borderLeft: `4px solid ${ev.recommendation === 'Recommended' || ev.recommendation === 'Accepted' ? '#057642' : ev.recommendation === 'Rejected' ? '#c5221f' : '#0a66c2'}`
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
                      justifyContent: 'center'
                    }}>
                      {ev.candidateName[0]}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', margin: 0 }}>{ev.candidateName}</h3>
                      <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.8rem', margin: 0 }}>Target Position: <strong>{ev.jobTitle}</strong></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`status-badge ${getStatusClass(ev.recommendation)}`}>
                      {ev.recommendation}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)' }}>
                      Evaluated {new Date(ev.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#fafafa', padding: '0.85rem', borderRadius: '6px', border: '1px solid #eeeeee' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>Scorecard Rating:</span>
                    <span style={{ fontWeight: 700, color: '#057642', fontSize: '0.9rem' }}>{ev.score} / 10</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(0,0,0,0.9)', fontStyle: 'italic' }}>
                    "{ev.comments}"
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
              <p style={{ color: 'rgba(0,0,0,0.6)' }}>No candidate evaluation history recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvaluations;
