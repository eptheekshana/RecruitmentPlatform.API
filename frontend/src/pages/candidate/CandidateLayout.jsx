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
      {/* Left Sidebar: Classic LinkedIn Side Menu Bar */}
      <aside style={{ width: '225px', flexShrink: 0 }}>
        {/* Profile Card Widget */}
        <div className="linkedin-profile-card">
          <div className="linkedin-cover-banner" style={{ background: 'linear-gradient(135deg, #a0b4b7 0%, #004182 100%)' }} />
          <div className="linkedin-avatar-container">
            <div className="linkedin-avatar-circle">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'C'}
            </div>
          </div>
          <div className="linkedin-profile-info">
            <div className="linkedin-profile-name">{user?.firstName} {user?.lastName}</div>
            <div className="linkedin-profile-headline">Software Candidate & Applicant</div>
          </div>
          <div className="linkedin-profile-stats">
            <div className="linkedin-stat-row">
              <span>Profile viewers</span>
              <span className="linkedin-stat-number">142</span>
            </div>
            <div className="linkedin-stat-row">
              <span>Connections</span>
              <span className="linkedin-stat-number">500+</span>
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #eeeeee', fontSize: '0.75rem' }}>
            <span style={{ color: 'rgba(0,0,0,0.6)' }}>Access exclusive tools & insights</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginTop: '2px' }}>
              <span style={{ background: '#f8c77e', color: '#915907', width: '12px', height: '12px', borderRadius: '2px', display: 'inline-block' }} />
              <span>Try Career Premium for $0</span>
            </div>
          </div>
          <div style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>My items</span>
          </div>
        </div>

        {/* Side Menu Navigation List Card */}
        <div className="linkedin-card" style={{ padding: '0.75rem 0' }}>
          <div style={{ padding: '0 1rem 0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Candidate Navigation
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

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>

      {/* Right Sidebar: LinkedIn News & Trends */}
      <aside style={{ width: '280px', flexShrink: 0 }} className="linkedin-right-widget">
        <div className="linkedin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>LinkedIn News</h3>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>Tech hiring surges in 2026</div>
              <div style={{ fontSize: '0.725rem', color: 'rgba(0,0,0,0.5)' }}>1d ago • 18,420 readers</div>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>Top skills software recruiters seek</div>
              <div style={{ fontSize: '0.725rem', color: 'rgba(0,0,0,0.5)' }}>2d ago • 9,150 readers</div>
            </li>
            <li>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>Remote engineering roles up 22%</div>
              <div style={{ fontSize: '0.725rem', color: 'rgba(0,0,0,0.5)' }}>3d ago • 25,800 readers</div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CandidateLayout;
