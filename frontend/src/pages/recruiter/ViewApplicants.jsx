import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const mockApplicants = [
  { id: 1, name: 'Alice Smith', role: 'Senior Frontend Developer', status: 'New', match: 92, appliedDate: '2026-07-19', skills: ['React', 'TypeScript', 'Tailwind CSS'], experience: '5 years', email: 'alice.smith@example.com' },
  { id: 2, name: 'Bob Johnson', role: 'UX/UI Designer', status: 'Shortlisted', match: 85, appliedDate: '2026-07-18', skills: ['Figma', 'Sketch', 'Prototyping'], experience: '4 years', email: 'bob.j@example.com' },
  { id: 3, name: 'Charlie Davis', role: 'Backend Engineer', status: 'Interviewing', match: 96, appliedDate: '2026-07-15', skills: ['Node.js', 'PostgreSQL', 'AWS'], experience: '7 years', email: 'charlie.d@example.com' },
  { id: 4, name: 'Diana Prince', role: 'Product Manager', status: 'Rejected', match: 65, appliedDate: '2026-07-10', skills: ['Agile', 'Scrum', 'Jira'], experience: '3 years', email: 'diana.p@example.com' },
  { id: 5, name: 'Evan Wright', role: 'Senior Frontend Developer', status: 'New', match: 88, appliedDate: '2026-07-20', skills: ['Vue.js', 'JavaScript', 'CSS'], experience: '6 years', email: 'evan.w@example.com' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'New': return '#3b82f6';
    case 'Shortlisted': return '#f59e0b';
    case 'Interviewing': return '#8b5cf6';
    case 'Rejected': return '#ef4444';
    case 'Hired': return '#10b981';
    default: return 'var(--text-secondary)';
  }
};

const ViewApplicants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants, setApplicants] = useState(mockApplicants);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  const closeButtonRef = useRef(null);
  const lastFocusedTriggerRef = useRef(null);

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesRole = roleFilter === 'All' || app.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const uniqueRoles = ['All', ...new Set(mockApplicants.map(app => app.role))];
  const statuses = ['All', 'New', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'];

  const handleOpenDrawer = (applicant, event) => {
    lastFocusedTriggerRef.current = event.currentTarget;
    setSelectedApplicant(applicant);
  };

  const handleCloseDrawer = () => {
    setSelectedApplicant(null);
    if (lastFocusedTriggerRef.current) {
      lastFocusedTriggerRef.current.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedApplicant) {
        handleCloseDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedApplicant]);

  useEffect(() => {
    if (selectedApplicant) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [selectedApplicant]);

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplicant) return;
    setApplicants(prev => prev.map(app => 
      app.id === selectedApplicant.id ? { ...app, status: newStatus } : app
    ));
    setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
    setStatusAnnouncement(`Application status for ${selectedApplicant.name} updated to ${newStatus}`);

    try {
      await api.applications.updateStatus(selectedApplicant.id, newStatus).catch(() => null);
    } catch {}
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%', overflowX: 'hidden' }} className="animate-fade-in delay-100">
      <div className="sr-only" role="status" aria-live="polite">
        {statusAnnouncement}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Review Applications</h1>
        
        <form onSubmit={(e) => e.preventDefault()} role="search">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 250px', position: 'relative' }}>
              <label htmlFor="applicant-search" className="sr-only">Search candidates by name or skill</label>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true">🔍</span>
              <input 
                id="applicant-search"
                type="text" 
                className="form-input" 
                placeholder="Search by name or skill..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
            <div style={{ flex: '0 0 200px' }}>
              <label htmlFor="role-filter" className="sr-only">Filter candidates by role</label>
              <select 
                id="role-filter"
                className="form-input" 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '0 0 180px' }}>
              <label htmlFor="status-filter" className="sr-only">Filter candidates by status</label>
              <select 
                id="status-filter"
                className="form-input" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }} aria-live="polite" aria-atomic="true">
          {filteredApplicants.length} {filteredApplicants.length === 1 ? 'Candidate' : 'Candidates'} Found
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map(app => (
            <div 
              key={app.id} 
              tabIndex={0}
              role="button"
              aria-label={`View application for ${app.name}, ${app.role}, status ${app.status}, match ${app.match}%`}
              onClick={(e) => handleOpenDrawer(app, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenDrawer(app, e);
                }
              }}
              className="glass-panel" 
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                borderColor: selectedApplicant?.id === app.id ? 'var(--accent-primary)' : 'var(--glass-border)',
                transform: selectedApplicant?.id === app.id ? 'translateY(-2px)' : 'none',
                boxShadow: selectedApplicant?.id === app.id ? '0 0 20px rgba(99,102,241,0.2)' : 'var(--glass-shadow)',
                outline: 'none'
              }}
            >
              <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{app.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{app.role}</p>
                </div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '6px', 
                  fontSize: '0.875rem',
                  color: getStatusColor(app.status),
                  fontWeight: 600
                }}>
                  {app.status}
                </div>
              </div>
              
              <div className="flex justify-between items-center" style={{ fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Applied: {app.appliedDate}</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{app.match}% Match</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }} role="status" aria-live="polite">
            No candidates match your criteria.
          </div>
        )}
      </div>

      {/* Slide-out Review Panel Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-candidate-name"
        style={{
          position: 'fixed',
          top: 0,
          right: selectedApplicant ? 0 : '-100%',
          width: '100%',
          maxWidth: '450px',
          height: '100vh',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--glass-border)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          transition: 'right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {selectedApplicant && (
          <>
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 id="drawer-candidate-title" style={{ fontSize: '1.5rem', margin: 0 }}>Candidate Profile</h2>
              <button 
                ref={closeButtonRef}
                onClick={handleCloseDrawer}
                aria-label="Close candidate profile drawer"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 id="drawer-candidate-name" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedApplicant.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>{selectedApplicant.role}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                  <span>📧 {selectedApplicant.email}</span>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>
                  Application Status
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="group" aria-label="Update candidate status">
                  {['New', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusUpdate(status)}
                      aria-pressed={selectedApplicant.status === status}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '99px',
                        border: selectedApplicant.status === status ? `1px solid ${getStatusColor(status)}` : '1px solid var(--glass-border)',
                        background: selectedApplicant.status === status ? `${getStatusColor(status)}20` : 'transparent',
                        color: selectedApplicant.status === status ? getStatusColor(status) : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: selectedApplicant.status === status ? 600 : 400,
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Overview</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Match Score</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#10b981' }}>{selectedApplicant.match}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Experience</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedApplicant.experience}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Skills</h4>
                <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedApplicant.skills.map(skill => (
                    <span key={skill} style={{ padding: '0.35rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '99px', fontSize: '0.875rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1.5rem', border: '1px dashed var(--glass-border)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">📄</div>
                <h4 style={{ marginBottom: '1rem' }}>Resume & CV</h4>
                <button type="button" className="btn btn-secondary" style={{ width: '100%' }}>View Document</button>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Backdrop for panel */}
      {selectedApplicant && (
        <div 
          onClick={handleCloseDrawer}
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ViewApplicants;
