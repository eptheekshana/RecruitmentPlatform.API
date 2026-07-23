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
      <div className="linkedin-card text-center" style={{ padding: '4rem' }}>
        <p style={{ color: 'var(--text-sub)' }}>Compiling platform metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="linkedin-card text-center" style={{ padding: '4rem' }}>
        <p style={{ color: 'var(--text-sub)' }}>Failed to load analytics dashboard data.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="fade-in">
      
      {/* Title */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', margin: 0 }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          System Administration & Analytics
        </h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>
          Real-time overview of user registrations, job posting pipelines, and system security logs.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        
        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0, borderTop: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registered Users</div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.35rem 0 0 0', color: 'var(--primary)' }}>{data.totalUsers}</p>
        </div>

        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0, borderTop: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Job Postings</div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.35rem 0 0 0', color: 'var(--primary)' }}>{data.totalJobPostings}</p>
        </div>

        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0, borderTop: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Submitted Applications</div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.35rem 0 0 0', color: 'var(--primary)' }}>{data.totalApplications}</p>
        </div>

        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0, borderTop: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average AI Suitability</div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.35rem 0 0 0', color: '#10b981' }}>{data.averageAIScore}%</p>
        </div>

      </div>

      {/* Breakdowns section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Application Status Pipeline */}
        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Application Status Breakdown
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.applicationsByStatus.length > 0 ? (
              data.applicationsByStatus.map(status => {
                const percentage = data.totalApplications > 0 ? Math.round((status.count / data.totalApplications) * 100) : 0;
                return (
                  <div key={status.status}>
                    <div className="flex justify-between" style={{ fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{status.status}</span>
                      <span style={{ color: 'var(--text-sub)' }}>{status.count} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: status.status === 'Accepted' || status.status === 'Hired' ? '#10b981' : 
                                    status.status === 'Rejected' ? '#ef4444' : 
                                    'var(--primary)',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>No status breakdown statistics yet.</p>
            )}
          </div>
        </div>

        {/* Jobs by Department */}
        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Postings by Department
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.jobsByDepartment.length > 0 ? (
              data.jobsByDepartment.map(dept => {
                const percentage = data.totalJobPostings > 0 ? Math.round((dept.count / data.totalJobPostings) * 100) : 0;
                return (
                  <div key={dept.department}>
                    <div className="flex justify-between" style={{ fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dept.department}</span>
                      <span style={{ color: 'var(--text-sub)' }}>{dept.count} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'var(--primary)',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>No jobs registered in departments.</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Security Audit Log */}
      <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          Recent Security Audit Events
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.recentLogs.length > 0 ? (
            data.recentLogs.map(log => {
              const isActionRisk = log.action.toLowerCase().includes('delete') || log.action.toLowerCase().includes('revoke');
              return (
                <div
                  key={log.auditLogId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.825rem',
                    padding: '0.6rem 0.85rem',
                    background: 'var(--border-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: isActionRisk ? '#ef4444' : 'var(--primary)', marginRight: '0.5rem' }}>
                      [{log.action}]
                    </span>
                    <span style={{ color: 'var(--text-main)' }}>{log.details}</span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                    <div style={{ color: 'var(--text-sub)', fontSize: '0.775rem' }}>by {log.userEmail}</div>
                    <div style={{ color: 'var(--text-disabled)', fontSize: '0.725rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>No audit events logged.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default SystemAnalytics;
