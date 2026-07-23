import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HiringManagerLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      name: 'Shortlisted Candidates',
      path: '/hiring-manager/shortlist',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    },
    {
      name: 'My Evaluations',
      path: '/hiring-manager/evaluations',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
  ];

  return (
    <div className="container flex gap-6" style={{ paddingBottom: '3rem' }}>
      {/* Left Sidebar: Classic LinkedIn Side Menu Bar */}
      <aside style={{ width: '225px', flexShrink: 0 }}>
        <div className="linkedin-profile-card">
          <div className="linkedin-cover-banner" style={{ background: 'var(--accent-gradient)' }} />
          <div className="linkedin-avatar-container">
            <div className="linkedin-avatar-circle" style={{ background: 'var(--primary-hover)' }}>
              {user?.firstName ? user.firstName[0].toUpperCase() : 'H'}
            </div>
          </div>
          <div className="linkedin-profile-info" style={{ borderBottom: 'none' }}>
            <div className="linkedin-profile-name">{user?.firstName} {user?.lastName}</div>
            <div className="linkedin-profile-headline">Hiring Team Lead</div>
          </div>
        </div>

        <div className="linkedin-card" style={{ padding: '0.75rem 0' }}>
          <div style={{ padding: '0 1rem 0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Manager Navigation
          </div>
          <nav className="flex flex-col">
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
                    gap: '0.75rem',
                    padding: '0.65rem 1rem',
                    fontSize: '0.85rem',
                    color: isActive ? 'var(--primary)' : 'var(--text-sub)',
                    fontWeight: isActive ? 600 : 500,
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
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
