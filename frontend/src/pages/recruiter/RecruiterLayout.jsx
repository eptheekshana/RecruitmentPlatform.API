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
      {/* Left Sidebar Layout */}
      <aside style={{ width: '230px', flexShrink: 0 }}>
        <div className="linkedin-card" style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', margin: 0 }}>
          
          {/* User Profile Header */}
          <div style={{ padding: '0 1.25rem 1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.05rem',
              flexShrink: 0
            }}>
              {user?.firstName ? user.firstName[0].toUpperCase() : 'R'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-sub)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                Talent Recruiter
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ padding: '0 1rem 0.25rem 1.25rem', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recruiter Menu
          </div>
          <nav className="flex flex-col" style={{ gap: '2px' }}>
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
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    color: isActive ? 'var(--primary)' : 'var(--text-sub)',
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    borderLeft: isActive ? '3.5px solid var(--primary)' : '3.5px solid transparent',
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

export default RecruiterLayout;
