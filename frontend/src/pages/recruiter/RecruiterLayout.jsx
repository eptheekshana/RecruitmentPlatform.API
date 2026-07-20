import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const RecruiterLayout = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Post a Job',
      path: '/recruiter/create-job',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
        </svg>
      )
    },
    {
      name: 'View Applicants',
      path: '/recruiter/applicants',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
  ];

  return (
    <div className="container flex gap-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '240px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '2.5rem 2rem', position: 'sticky', top: '100px' }}>
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
                    gap: '0.85rem',
                    padding: '1.05rem 1.25rem',
                    borderRadius: '12px',
                    transition: 'var(--transition-smooth)',
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' }} aria-hidden="true">{item.icon}</span>
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
