import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const RecruiterLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Post a Job', path: '/recruiter/create-job', icon: '📝' },
    { name: 'View Applicants', path: '/recruiter/applicants', icon: '👥' },
  ];

  return (
    <div className="container flex gap-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '280px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '2rem 1.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Recruiter Portal</h2>
          <nav className="flex flex-col gap-2" aria-label="Recruiter Portal Navigation">
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
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
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

export default RecruiterLayout;
