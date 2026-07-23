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
              {user?.firstName ? user.firstName[0].toUpperCase() : 'H'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-sub)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                Hiring Team Lead
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ padding: '0 1rem 0.25rem 1.25rem', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Manager Menu
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

export default HiringManagerLayout;
