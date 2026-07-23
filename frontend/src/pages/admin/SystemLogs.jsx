import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SystemLogs = () => {
  const { token, API_BASE_URL } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [searchQuery]);

  const fetchLogs = async () => {
    if (!token) return;
    try {
      const url = searchQuery.trim() 
        ? `${API_BASE_URL}/admin/logs?query=${encodeURIComponent(searchQuery)}`
        : `${API_BASE_URL}/admin/logs`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeClass = (action) => {
    const act = action.toLowerCase();
    if (act.includes('delete') || act.includes('remove') || act.includes('revoke')) return 'rejected';
    if (act.includes('evaluate') || act.includes('approve') || act.includes('match')) return 'shortlisted';
    return 'applied';
  };

  return (
    <div className="fade-in">
      {/* Search and header bar */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          Security Audit Activity Stream
        </h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Track logs of administrative updates and recruitment security events in real time.
        </p>
        
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)', display: 'flex', alignItems: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Search audit activity by action, details description, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', borderRadius: '20px' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-sub)' }}>Loading security audit logs...</p>
        </div>
      ) : (
        <div className="linkedin-card" style={{ padding: '1rem', overflowX: 'auto', margin: 0 }}>
          <table className="linkedin-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '20%', color: 'var(--text-sub)' }}>Timestamp</th>
                <th style={{ width: '18%', color: 'var(--text-sub)' }}>Action Event</th>
                <th style={{ width: '42%', color: 'var(--text-sub)' }}>Details Description</th>
                <th style={{ width: '20%', color: 'var(--text-sub)' }}>Initiated By</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.auditLogId}>
                    <td style={{ color: 'var(--text-sub)', fontSize: '0.8rem', padding: '0.75rem 1rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`status-badge ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-main)', fontSize: '0.85rem', padding: '0.75rem 1rem' }}>{log.details}</td>
                    <td style={{ color: 'var(--text-sub)', fontSize: '0.8rem', padding: '0.75rem 1rem' }}>
                      {log.userEmail}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-disabled)' }}>
                    No audit log records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;
