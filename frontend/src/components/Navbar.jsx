import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '53px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container flex justify-between items-center" style={{ width: '100%', height: '100%' }}>
        {/* Left: Brand Logo & LinkedIn Search Box */}
        <div className="flex items-center gap-2">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }} aria-label="LinkedIn Home">
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '4px',
                background: '#0a66c2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1.25rem',
                color: '#ffffff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
              aria-hidden="true"
            >
              in
            </div>
          </Link>

          {/* LinkedIn Search Bar */}
          <form onSubmit={handleSearchSubmit} className="linkedin-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              color: location.pathname === '/' ? '#000000e6' : 'rgba(0,0,0,0.6)',
              borderBottom: location.pathname === '/' ? '2px solid #000000e6' : '2px solid transparent',
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
              color: location.pathname.includes('users') || location.pathname.includes('applicants') ? '#000000e6' : 'rgba(0,0,0,0.6)',
              borderBottom: (location.pathname.includes('users') || location.pathname.includes('applicants')) ? '2px solid #000000e6' : '2px solid transparent',
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
              color: (location.pathname.includes('jobs') || location.pathname.includes('create-job')) ? '#000000e6' : 'rgba(0,0,0,0.6)',
              borderBottom: (location.pathname.includes('jobs') || location.pathname.includes('create-job')) ? '2px solid #000000e6' : '2px solid transparent',
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
              color: location.pathname.includes('evaluations') ? '#000000e6' : 'rgba(0,0,0,0.6)',
              borderBottom: location.pathname.includes('evaluations') ? '2px solid #000000e6' : '2px solid transparent',
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
              color: location.pathname.includes('logs') ? '#000000e6' : 'rgba(0,0,0,0.6)',
              borderBottom: location.pathname.includes('logs') ? '2px solid #000000e6' : '2px solid transparent',
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

          {/* User "Me" Dropdown or Auth buttons */}
          {user ? (
            <div style={{ position: 'relative', height: '100%', borderLeft: '1px solid #eeeeee', marginLeft: '0.5rem' }}>
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
                  color: 'rgba(0,0,0,0.6)',
                  cursor: 'pointer'
                }}
                aria-expanded={showUserMenu}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#0a66c2',
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
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px 0 8px 8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    padding: '1rem',
                    zIndex: 200
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eeeeee' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#0a66c2',
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
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'rgba(0,0,0,0.9)' }}>
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
                          background: '#e8f0fe',
                          color: '#0a66c2',
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
