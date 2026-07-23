import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RecruiterLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      name: 'View Applicants',
      path: '/recruiter/applicants',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      name: 'Post a New Job',
      path: '/recruiter/create-job',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
        </svg>
      )
    },
  ];

  return (
    <div className="container flex gap-6" style={{ paddingBottom: '3rem' }}>
      {/* Left Sidebar: Classic LinkedIn Recruiter Side Menu Bar */}
      <aside style={{ width: '225px', flexShrink: 0 }}>
        {/* Profile Card Box */}
        <div className="linkedin-profile-card">
          <div className="linkedin-cover-banner" style={{ background: 'var(--accent-gradient)' }} />
          <div className="linkedin-avatar-container">
            <div className="linkedin-avatar-circle" style={{ background: 'var(--primary-hover)' }}>
              {user?.firstName ? user.firstName[0].toUpperCase() : 'R'}
            </div>
          </div>
          <div className="linkedin-profile-info" style={{ borderBottom: 'none' }}>
            <div className="linkedin-profile-name">{user?.firstName} {user?.lastName}</div>
            <div className="linkedin-profile-headline">Talent Acquisition Recruiter</div>
          </div>
        </div>

        {/* Side Menu Navigation Card */}
        <div className="linkedin-card" style={{ padding: '0.75rem 0' }}>
          <div style={{ padding: '0 1rem 0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recruiter Navigation
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

      {/* Main Feed Content Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default RecruiterLayout;
