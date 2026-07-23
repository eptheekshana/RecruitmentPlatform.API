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
    <div>
      {/* Title */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.2rem' }}>Security Audit Activity Stream</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>Tracking logs of administrative updates and recruitment security events.</p>
        
        <div>
          <input
            type="text"
            className="form-input"
            placeholder="Search audit activity by action, details description, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'rgba(0,0,0,0.6)' }}>Loading security audit logs...</p>
        </div>
      ) : (
        <div className="linkedin-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table className="linkedin-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Timestamp</th>
                <th style={{ width: '18%' }}>Action Event</th>
                <th style={{ width: '42%' }}>Details Description</th>
                <th style={{ width: '20%' }}>Initiated By</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.auditLogId}>
                    <td style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.825rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: 'rgba(0,0,0,0.9)' }}>{log.details}</td>
                    <td style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.825rem' }}>
                      {log.userEmail}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
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
