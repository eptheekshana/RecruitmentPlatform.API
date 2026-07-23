import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && user?.role === 'Candidate') {
      navigate(`/candidate/jobs?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getPortalLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'Candidate': return '/candidate/jobs';
      case 'Recruiter': return '/recruiter/applicants';
      case 'HiringManager': return '/hiring-manager/shortlist';
      case 'Admin': return '/admin/analytics';
      default: return '/';
    }
  };

  return (
    <header
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '53px',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <div className="container flex justify-between items-center" style={{ width: '100%', height: '100%' }}>
        {/* Left: Brand Logo & Search Box */}
        <div className="flex items-center gap-3">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }} aria-label="ApexRecruit Home">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L3 10L16 18L29 10L16 2Z" fill="url(#logo-grad-1)" />
              <path d="M3 22L16 30L29 22" stroke="url(#logo-grad-2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 16L16 21.5L25 16" stroke="url(#logo-grad-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo-grad-1" x1="3" y1="2" x2="29" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="logo-grad-2" x1="3" y1="22" x2="29" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center' }}>
              Apex<span style={{ color: 'var(--primary)' }}>Recruit</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="linkedin-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="linkedin-search-input"
              placeholder="Search jobs, candidates, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search jobs, candidates, skills"
            />
          </form>
        </div>

        {/* Center/Right Navigation Icons (Classic LinkedIn Horizontal Nav Bar) */}
        <nav className="flex items-center" style={{ height: '100%' }}>
          {/* Home Tab */}
          <Link
            to="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.85rem',
              height: '100%',
              color: location.pathname === '/' ? 'var(--text-main)' : 'var(--text-sub)',
              borderBottom: location.pathname === '/' ? '2px solid var(--primary)' : '2px solid transparent',
              textDecoration: 'none',
              fontSize: '0.725rem',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={location.pathname === '/' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </Link>

          {/* My Network Tab */}
          <Link
            to={getPortalLink()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.85rem',
              height: '100%',
              color: (location.pathname.includes('users') || location.pathname.includes('applicants')) ? 'var(--text-main)' : 'var(--text-sub)',
              borderBottom: (location.pathname.includes('users') || location.pathname.includes('applicants')) ? '2px solid var(--primary)' : '2px solid transparent',
              textDecoration: 'none',
              fontSize: '0.725rem',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>My Network</span>
          </Link>

          {/* Jobs Tab */}
          <Link
            to={user?.role === 'Candidate' ? '/candidate/jobs' : user?.role === 'Recruiter' ? '/recruiter/create-job' : '/candidate/jobs'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.85rem',
              height: '100%',
              color: (location.pathname.includes('jobs') || location.pathname.includes('create-job')) ? 'var(--text-main)' : 'var(--text-sub)',
              borderBottom: (location.pathname.includes('jobs') || location.pathname.includes('create-job')) ? '2px solid var(--primary)' : '2px solid transparent',
              textDecoration: 'none',
              fontSize: '0.725rem',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Jobs</span>
          </Link>

          {/* Messaging Tab */}
          <Link
            to={user?.role === 'HiringManager' ? '/hiring-manager/evaluations' : getPortalLink()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.85rem',
              height: '100%',
              color: location.pathname.includes('evaluations') ? 'var(--text-main)' : 'var(--text-sub)',
              borderBottom: location.pathname.includes('evaluations') ? '2px solid var(--primary)' : '2px solid transparent',
              textDecoration: 'none',
              fontSize: '0.725rem',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Messaging</span>
          </Link>

          {/* Notifications Tab */}
          <Link
            to={user?.role === 'Admin' ? '/admin/logs' : getPortalLink()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.85rem',
              height: '100%',
              color: location.pathname.includes('logs') ? 'var(--text-main)' : 'var(--text-sub)',
              borderBottom: location.pathname.includes('logs') ? '2px solid var(--primary)' : '2px solid transparent',
              textDecoration: 'none',
              fontSize: '0.725rem',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span>Notifications</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.85rem',
              height: '100%',
              color: 'var(--text-sub)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'color 0.2s ease'
            }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span style={{ fontSize: '0.725rem', marginTop: '2px' }}>
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* User "Me" Dropdown or Auth buttons */}
          {user ? (
            <div style={{ position: 'relative', height: '100%', borderLeft: '1px solid var(--border-subtle)', marginLeft: '0.5rem' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 0.85rem',
                  height: '100%',
                  color: 'var(--text-sub)',
                  cursor: 'pointer'
                }}
                aria-expanded={showUserMenu}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.725rem', marginTop: '2px' }}>
                  <span>Me</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '53px',
                    width: '260px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px 0 8px 8px',
                    boxShadow: 'var(--shadow-md)',
                    padding: '1rem',
                    zIndex: 200,
                    transition: 'background-color 0.3s ease, border-color 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>
                        {user.email}
                      </div>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '4px',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontWeight: 600
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={getPortalLink()}
                    onClick={() => setShowUserMenu(false)}
                    className="btn-linkedin-outline"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.35rem', marginBottom: '0.5rem', textAlign: 'center' }}
                  >
                    View Profile & Portal
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="btn-linkedin-outline"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.35rem', borderColor: '#f5c2c0', color: '#c5221f' }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2" style={{ marginLeft: '0.5rem' }}>
              <Link to="/login" className="btn-linkedin-outline" style={{ fontSize: '0.825rem', padding: '0.3rem 0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-linkedin-primary" style={{ fontSize: '0.825rem', padding: '0.3rem 0.85rem' }}>
                Join Now
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
