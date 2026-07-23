import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { 
      name: 'System Analytics', 
      path: '/admin/analytics', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    { 
      name: 'User Directory', 
      path: '/admin/users', 
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
      name: 'Security Activity Logs', 
      path: '/admin/logs', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7s0 6 8 10z" />
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
              {user?.firstName ? user.firstName[0].toUpperCase() : 'A'}
            </div>
          </div>
          <div className="linkedin-profile-info" style={{ borderBottom: 'none' }}>
            <div className="linkedin-profile-name">{user?.firstName} {user?.lastName}</div>
            <div className="linkedin-profile-headline">Platform Administrator</div>
          </div>
        </div>

        <div className="linkedin-card" style={{ padding: '0.75rem 0' }}>
          <div style={{ padding: '0 1rem 0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Admin Navigation
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

export default AdminLayout;
