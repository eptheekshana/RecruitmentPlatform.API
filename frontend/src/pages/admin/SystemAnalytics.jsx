import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SystemAnalytics = () => {
  const { token, API_BASE_URL } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const stats = await res.json();
        setData(stats);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel text-center" style={{ padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Compiling platform metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-panel text-center" style={{ padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load analytics dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in delay-100 flex flex-col gap-6">
      
      {/* Title */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>System Administration Analytics</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time overview of platform activity, candidate screening pipeline, and system health</p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Total Accounts</h3>
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{data.totalUsers}</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'var(--accent-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Job Posting Count</h3>
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{data.totalJobPostings}</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#38bdf8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <polyline points="9 14 12 17 15 14" />
              </svg>
            </div>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Applications Submitted</h3>
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{data.totalApplications}</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#10b981', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8.01" y2="16" />
                <line x1="16" y1="16" x2="16.01" y2="16" />
              </svg>
            </div>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Average Match Fit</h3>
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: '#10b981' }}>{data.averageAIScore}%</p>
        </div>

      </div>

      {/* Breakdowns section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Application Status Pipeline */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Application Pipeline Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.applicationsByStatus.length > 0 ? (
              data.applicationsByStatus.map(status => {
                const percentage = data.totalApplications > 0 ? Math.round((status.count / data.totalApplications) * 100) : 0;
                return (
                  <div key={status.status}>
                    <div className="flex justify-between" style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 500 }}>{status.status}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{status.count} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: status.status === 'Accepted' ? '#10b981' : 
                                    status.status === 'Rejected' ? '#ef4444' : 
                                    status.status === 'Interviewing' ? '#c084fc' : 
                                    '#38bdf8',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No status breakdown statistics yet.</p>
            )}
          </div>
        </div>

        {/* Jobs by Department */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Postings by Department / Domain</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.jobsByDepartment.length > 0 ? (
              data.jobsByDepartment.map(dept => {
                const percentage = data.totalJobPostings > 0 ? Math.round((dept.count / data.totalJobPostings) * 100) : 0;
                return (
                  <div key={dept.department}>
                    <div className="flex justify-between" style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 500 }}>{dept.department}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{dept.count} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: '#38bdf8',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No jobs registered in departments.</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Security Activity Audit Log */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Security Audit Logs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.recentLogs.length > 0 ? (
            data.recentLogs.map(log => (
              <div
                key={log.auditLogId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#ef4444', marginRight: '0.5rem' }}>[{log.action}]</span>
                  <span style={{ color: 'var(--text-primary)' }}>{log.details}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>by {log.userEmail}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No audit events logged.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default SystemAnalytics;
