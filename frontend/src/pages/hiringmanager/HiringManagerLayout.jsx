import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const HiringManagerLayout = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Shortlisted Candidates',
      path: '/hiring-manager/shortlist',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    },
    {
      name: 'My Evaluations',
      path: '/hiring-manager/evaluations',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
  ];

  return (
    <div className="container flex gap-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '240px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '2.5rem 2rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Manager Portal</h2>
          <nav className="flex flex-col gap-2" aria-label="Hiring Manager Portal Navigation">
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
                    background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    border: isActive ? '1px solid #10b981' : '1px solid transparent'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#10b981' : 'var(--text-secondary)' }} aria-hidden="true">{item.icon}</span>
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

export default HiringManagerLayout;
