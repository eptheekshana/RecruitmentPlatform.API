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

  return (
    <nav
      aria-label="LinkedIn Main Navigation"
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
      <div className="container flex justify-between items-center" style={{ width: '100%' }}>
        {/* Left: Brand Logo & Search Box */}
        <div className="flex items-center gap-3">
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
            <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#0a66c2', letterSpacing: '-0.5px' }}>
              Recruit<span style={{ color: 'rgba(0,0,0,0.9)' }}>Hub</span>
            </span>
          </Link>

          {/* LinkedIn Search Bar */}
          <form onSubmit={handleSearchSubmit} className="linkedin-search-box" style={{ marginLeft: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Right: LinkedIn Vertical Icon Nav Tabs */}
        <div className="flex items-center gap-1" style={{ height: '53px' }}>
          {/* Home Nav Item */}
          <Link
            to="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 1rem',
              height: '100%',
              color: location.pathname === '/' ? '#000000e6' : 'rgba(0,0,0,0.6)',
              borderBottom: location.pathname === '/' ? '2px solid #000000e6' : '2px solid transparent',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              transition: 'color 0.15s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={location.pathname === '/' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </Link>

          {user ? (
            <>
              {/* Role Portal / Jobs Icon */}
              {user.role === 'Candidate' && (
                <Link
                  to="/candidate/jobs"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 1rem',
                    height: '100%',
                    color: location.pathname.startsWith('/candidate') ? '#000000e6' : 'rgba(0,0,0,0.6)',
                    borderBottom: location.pathname.startsWith('/candidate') ? '2px solid #000000e6' : '2px solid transparent',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={location.pathname.startsWith('/candidate') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Jobs</span>
                </Link>
              )}

              {(user.role === 'Recruiter' || user.role === 'Admin') && (
                <Link
                  to="/recruiter/applicants"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 1rem',
                    height: '100%',
                    color: location.pathname.startsWith('/recruiter') ? '#000000e6' : 'rgba(0,0,0,0.6)',
                    borderBottom: location.pathname.startsWith('/recruiter') ? '2px solid #000000e6' : '2px solid transparent',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Applicants</span>
                </Link>
              )}

              {user.role === 'HiringManager' && (
                <Link
                  to="/hiring-manager/shortlist"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 1rem',
                    height: '100%',
                    color: location.pathname.startsWith('/hiring-manager') ? '#000000e6' : 'rgba(0,0,0,0.6)',
                    borderBottom: location.pathname.startsWith('/hiring-manager') ? '2px solid #000000e6' : '2px solid transparent',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  <span>Evaluations</span>
                </Link>
              )}

              {user.role === 'Admin' && (
                <Link
                  to="/admin/analytics"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 1rem',
                    height: '100%',
                    color: location.pathname.startsWith('/admin') ? '#000000e6' : 'rgba(0,0,0,0.6)',
                    borderBottom: location.pathname.startsWith('/admin') ? '2px solid #000000e6' : '2px solid transparent',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Admin</span>
                </Link>
              )}

              {/* Classic LinkedIn "Me" Avatar Menu */}
              <div style={{ position: 'relative', height: '100%' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', marginTop: '2px' }}>
                    <span>Me</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

                    <button
                      onClick={handleLogout}
                      className="btn-linkedin-outline"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '0.35rem' }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2" style={{ marginLeft: '1rem' }}>
              <Link to="/login" className="btn-linkedin-outline" style={{ fontSize: '0.875rem', padding: '0.35rem 1rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-linkedin-primary" style={{ fontSize: '0.875rem', padding: '0.35rem 1rem' }}>
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
