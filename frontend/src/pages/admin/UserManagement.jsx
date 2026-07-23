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
    if (!window.confirm(`Are you sure you want to delete account ${userEmail}?`)) {
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
    <div>
      {toast && (
        <div
          className={`alert-box ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 110, maxWidth: '350px', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{toast.message}</div>
          <button style={{ background: 'none', border: 'none', marginLeft: 'auto', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* Main Header */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.2rem' }}>User Directory & Permissions</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>Manage user account roles, permissions, and platform access.</p>

        <div>
          <input
            type="text"
            className="form-input"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="linkedin-card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'rgba(0,0,0,0.6)' }}>Loading user accounts...</p>
        </div>
      ) : (
        <div className="linkedin-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table className="linkedin-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>User Name</th>
                <th style={{ width: '32%' }}>Email Address</th>
                <th style={{ width: '16%' }}>System Role</th>
                <th style={{ width: '15%' }}>Organization</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(u => {
                  const isSelf = u.userId === currentUser?.userId;
                  return (
                    <tr key={u.userId}>
                      <td style={{ fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>
                        {u.firstName} {u.lastName} {isSelf && <span style={{ color: '#057642', fontSize: '0.75rem' }}>(You)</span>}
                      </td>
                      <td style={{ color: 'rgba(0,0,0,0.6)' }}>{u.email}</td>
                      <td>
                        {updatingUserId === u.userId ? (
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <select
                              className="form-select"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem', width: 'auto' }}
                            >
                              <option value="Candidate">Candidate</option>
                              <option value="Recruiter">Recruiter</option>
                              <option value="HiringManager">Hiring Mngr</option>
                              <option value="Admin">Administrator</option>
                            </select>
                            <button
                              className="btn-linkedin-primary"
                              onClick={() => handleUpdateRole(u.userId, selectedRole)}
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Save
                            </button>
                            <button
                              className="btn-linkedin-outline"
                              onClick={() => setUpdatingUserId(null)}
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className={`status-badge ${u.role === 'Candidate' ? 'applied' : u.role === 'HiringManager' ? 'shortlisted' : 'underreview'}`}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>{u.organizationName}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-linkedin-outline"
                            onClick={() => { setUpdatingUserId(u.userId); setSelectedRole(u.role); }}
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                            disabled={isSelf}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.userId, u.email)}
                            style={{
                              background: 'transparent',
                              border: '1px solid #f5c2c0',
                              color: '#c5221f',
                              borderRadius: '16px',
                              padding: '0.25rem 0.65rem',
                              cursor: 'pointer',
                              fontSize: '0.775rem',
                              fontWeight: 600
                            }}
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
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
                    No user accounts match your search.
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
