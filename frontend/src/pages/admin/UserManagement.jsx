import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { token, user: currentUser, API_BASE_URL } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const list = await res.json();
        setUsers(list);
      }
    } catch (err) {
      console.error('Error fetching users list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();

      if (res.ok) {
        setToast({ type: 'success', message: 'User role updated successfully!' });
        setUsers(prev => prev.map(u => u.userId === userId ? { ...u, role: newRole } : u));
        setUpdatingUserId(null);
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to update user role.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error occurred.' });
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you absolutely sure you want to delete the user account for ${userEmail}? This will remove all their data.`)) {
      return;
    }
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setToast({ type: 'success', message: 'User deleted successfully!' });
        setUsers(prev => prev.filter(u => u.userId !== userId));
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to delete user.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error occurred.' });
    }
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }} className="animate-fade-in delay-100">

      {toast && (
        <div
          className={`alert-box ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 110, maxWidth: '350px' }}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{toast.message}</div>
          <button style={{ background: 'none', border: 'none', marginLeft: 'auto', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* Main Header */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>User Directory & Accounts Manager</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Authorize platform roles, review organization links, and revoke accounts</p>

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search users by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading user database records...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '1rem', width: '20%' }}>User Name</th>
                <th style={{ padding: '1rem', width: '32%' }}>Email Address</th>
                <th style={{ padding: '1rem', width: '13%' }}>System Role</th>
                <th style={{ padding: '1rem', width: '20%' }}>Org Linkage</th>
                <th style={{ padding: '1rem', width: '15%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(u => {
                  const isSelf = u.userId === currentUser?.userId;
                  return (
                    <tr key={u.userId} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.firstName} {u.lastName} {isSelf && <span style={{ color: '#10b981', fontSize: '0.75rem' }}>(You)</span>}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{u.email}</td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        {updatingUserId === u.userId ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                              className="form-input"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto', minWidth: '120px' }}
                            >
                              <option value="Candidate">Candidate</option>
                              <option value="Recruiter">Recruiter</option>
                              <option value="HiringManager">Hiring Mngr</option>
                              <option value="Admin">Administrator</option>
                            </select>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleUpdateRole(u.userId, selectedRole)}
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setUpdatingUserId(null)}
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            background: u.role === 'Candidate' ? 'rgba(37, 99, 235, 0.1)' :
                              u.role === 'HiringManager' ? 'rgba(16, 185, 129, 0.1)' :
                                u.role === 'Admin' ? 'rgba(239, 68, 68, 0.1)' :
                                  'rgba(147, 51, 234, 0.1)',
                            color: u.role === 'Candidate' ? 'var(--accent-primary)' :
                              u.role === 'HiringManager' ? '#10b981' :
                                u.role === 'Admin' ? '#ef4444' :
                                  '#9333ea',
                            border: `1px solid ${u.role === 'Candidate' ? 'rgba(37, 99, 235, 0.2)' :
                                u.role === 'HiringManager' ? 'rgba(16, 185, 129, 0.2)' :
                                  u.role === 'Admin' ? 'rgba(239, 68, 68, 0.2)' :
                                    'rgba(147, 51, 234, 0.2)'
                              }`
                          }}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.organizationName}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => { setUpdatingUserId(u.userId); setSelectedRole(u.role); }}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            disabled={isSelf}
                          >
                            Change Role
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDeleteUser(u.userId, u.email)}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444', whiteSpace: 'nowrap' }}
                            disabled={isSelf}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No users match your search term.
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

export default UserManagement;
