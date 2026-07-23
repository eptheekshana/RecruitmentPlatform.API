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
        <p style={{ color: 'rgba(0,0,0,0.6)' }}>Compiling platform metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="linkedin-card text-center" style={{ padding: '4rem' }}>
        <p style={{ color: 'rgba(0,0,0,0.6)' }}>Failed to load analytics dashboard data.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Title */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', margin: 0 }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.2rem' }}>System Administration & Analytics</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>Real-time overview of user registrations, job posting pipelines, and system security.</p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>Total Users</div>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.35rem 0 0 0', color: '#0a66c2' }}>{data.totalUsers}</p>
        </div>

        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>Active Jobs</div>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.35rem 0 0 0', color: '#004182' }}>{data.totalJobPostings}</p>
        </div>

        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>Applications</div>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.35rem 0 0 0', color: '#0a66c2' }}>{data.totalApplications}</p>
        </div>

        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>Average Match Fit</div>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.35rem 0 0 0', color: '#057642' }}>{data.averageAIScore}%</p>
        </div>

      </div>

      {/* Breakdowns section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        
        {/* Application Status Pipeline */}
        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(0,0,0,0.9)' }}>Application Status Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.applicationsByStatus.length > 0 ? (
              data.applicationsByStatus.map(status => {
                const percentage = data.totalApplications > 0 ? Math.round((status.count / data.totalApplications) * 100) : 0;
                return (
                  <div key={status.status}>
                    <div className="flex justify-between" style={{ fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.8)' }}>{status.status}</span>
                      <span style={{ color: 'rgba(0,0,0,0.6)' }}>{status.count} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#eeeeee', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: status.status === 'Accepted' ? '#057642' : 
                                    status.status === 'Rejected' ? '#c5221f' : 
                                    '#0a66c2',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>No status breakdown statistics yet.</p>
            )}
          </div>
        </div>

        {/* Jobs by Department */}
        <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(0,0,0,0.9)' }}>Postings by Department</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.jobsByDepartment.length > 0 ? (
              data.jobsByDepartment.map(dept => {
                const percentage = data.totalJobPostings > 0 ? Math.round((dept.count / data.totalJobPostings) * 100) : 0;
                return (
                  <div key={dept.department}>
                    <div className="flex justify-between" style={{ fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.8)' }}>{dept.department}</span>
                      <span style={{ color: 'rgba(0,0,0,0.6)' }}>{dept.count} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#eeeeee', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: '#0a66c2',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>No jobs registered in departments.</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Security Audit Log */}
      <div className="linkedin-card" style={{ padding: '1.25rem', margin: 0 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'rgba(0,0,0,0.9)' }}>Recent Security Audit Logs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.recentLogs.length > 0 ? (
            data.recentLogs.map(log => (
              <div
                key={log.auditLogId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.825rem',
                  padding: '0.6rem 0.85rem',
                  background: '#fafafa',
                  border: '1px solid #eeeeee',
                  borderRadius: '4px'
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#c5221f', marginRight: '0.5rem' }}>[{log.action}]</span>
                  <span style={{ color: 'rgba(0,0,0,0.9)' }}>{log.details}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <div style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.775rem' }}>by {log.userEmail}</div>
                  <div style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.725rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>No audit events logged.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default SystemAnalytics;
