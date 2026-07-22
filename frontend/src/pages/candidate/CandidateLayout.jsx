import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const CandidateLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Profile Management', path: '/candidate/profile', icon: '👤' },
    { name: 'CV Upload', path: '/candidate/cv-upload', icon: '📄' },
    { name: 'Job Search', path: '/candidate/jobs', icon: '🔍' },
  ];

  return (
    <div className="container flex gap-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '280px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '2rem 1.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Candidate Portal</h2>
          <nav className="flex flex-col gap-2" aria-label="Candidate Portal Navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    transition: 'var(--transition-smooth)',
                    background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }} aria-hidden="true">{item.icon}</span>
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default CandidateLayout;
