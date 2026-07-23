import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CandidateLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      name: 'Job Search',
      path: '/candidate/jobs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      name: 'Profile & Experience',
      path: '/candidate/profile',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      name: 'CV & Documents',
      path: '/candidate/cv-upload',
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
      {/* Left Sidebar: Classic LinkedIn Profile Card & Nav */}
      <aside style={{ width: '225px', flexShrink: 0 }}>
        {/* User Mini Profile Box */}
        <div className="linkedin-profile-card">
          <div className="linkedin-cover-banner" />
          <div className="linkedin-avatar-container">
            <div className="linkedin-avatar-circle">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'C'}
            </div>
          </div>
          <div className="linkedin-profile-info">
            <div className="linkedin-profile-name">{user?.firstName} {user?.lastName}</div>
            <div className="linkedin-profile-headline">Job Candidate & Applicant</div>
          </div>
          <div className="linkedin-profile-stats">
            <div className="linkedin-stat-row">
              <span>Profile views</span>
              <span className="linkedin-stat-number">142</span>
            </div>
            <div className="linkedin-stat-row">
              <span>Applications</span>
              <span className="linkedin-stat-number">12</span>
            </div>
          </div>
        </div>

        {/* Navigation Sidebar */}
        <div className="linkedin-card" style={{ padding: '0.75rem 0' }}>
          <div style={{ padding: '0 1rem 0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>
            Candidate Portal
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
                    fontSize: '0.875rem',
                    color: isActive ? '#0a66c2' : 'rgba(0,0,0,0.7)',
                    fontWeight: isActive ? 600 : 500,
                    background: isActive ? '#e8f0fe' : 'transparent',
                    borderLeft: isActive ? '3px solid #0a66c2' : '3px solid transparent',
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

      {/* Right Sidebar: LinkedIn News & Insights Widget */}
      <aside style={{ width: '280px', flexShrink: 0, display: 'none', minWidth: '280px' }} className="linkedin-right-widget">
        <div className="linkedin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>LinkedIn News & Trends</h3>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>Top tech skills in demand 2026</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)' }}>2d ago • 14,290 readers</div>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>AI interview prep strategies</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)' }}>1d ago • 8,920 readers</div>
            </li>
            <li>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>Remote engineering roles up 18%</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)' }}>3d ago • 22,410 readers</div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CandidateLayout;
