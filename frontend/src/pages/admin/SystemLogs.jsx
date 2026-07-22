import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SystemLogs = () => {
  const { token, API_BASE_URL } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [searchQuery]); // refetch when query updates

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

  const getActionBadgeStyle = (action) => {
    const act = action.toLowerCase();
    if (act.includes('delete') || act.includes('remove') || act.includes('revoke')) {
      return { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
    }
    if (act.includes('update') || act.includes('change') || act.includes('edit')) {
      return { background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' };
    }
    if (act.includes('evaluate') || act.includes('approve') || act.includes('match')) {
      return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
    }
    return { background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' };
  };

  return (
    <div className="animate-fade-in delay-100">
      
      {/* Title */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Security Audit Activity Stream</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Immutable tracking logs of administrative updates, match alterations, and recruitment actions</p>
        
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search activity stream by action keyword, details description, or user email details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading security activity stream...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '1.0rem', width: '20%' }}>Timestamp</th>
                <th style={{ padding: '1.0rem', width: '20%' }}>Action Event</th>
                <th style={{ padding: '1.0rem', width: '40%' }}>Details Description</th>
                <th style={{ padding: '1.0rem', width: '20%' }}>Initiated By</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.auditLogId} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '1.0rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '1.0rem', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        ...getActionBadgeStyle(log.action)
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1.0rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>{log.details}</td>
                    <td style={{ padding: '1.0rem', color: 'var(--text-secondary)', fontWeight: 500, wordBreak: 'break-all' }}>
                      {log.userEmail}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
