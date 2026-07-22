import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      aria-label="Main Navigation"
      style={{
        padding: '1.25rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div className="container flex justify-between items-center">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} aria-label="RecruitHub Home">
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#ffffff'
            }}
            aria-hidden="true"
          >
            R
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: '#ffffff' }}>
            Recruit<span className="text-gradient">Hub</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            aria-current={location.pathname === '/' ? 'page' : undefined}
            style={{
              color: location.pathname === '/' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 500,
              transition: 'var(--transition-smooth)'
            }}
          >
            Home
          </Link>

          {user ? (
            <>
              {user.role === 'Candidate' && (
                <Link
                  to="/candidate/jobs"
                  aria-current={location.pathname.startsWith('/candidate') ? 'page' : undefined}
                  style={{
                    color: location.pathname.startsWith('/candidate') ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  Candidate Portal
                </Link>
              )}

              {user.role === 'Recruiter' && (
                <Link
                  to="/recruiter/applicants"
                  aria-current={location.pathname.startsWith('/recruiter') ? 'page' : undefined}
                  style={{
                    color: location.pathname.startsWith('/recruiter') ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  Recruiter Portal
                </Link>
              )}

              {user.role === 'HiringManager' && (
                <Link
                  to="/hiring-manager/shortlist"
                  aria-current={location.pathname.startsWith('/hiring-manager') ? 'page' : undefined}
                  style={{
                    color: location.pathname.startsWith('/hiring-manager') ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  Hiring Manager
                </Link>
              )}

              {user.role === 'Admin' && (
                <>
                  <Link
                    to="/recruiter/applicants"
                    aria-current={location.pathname.startsWith('/recruiter') ? 'page' : undefined}
                    style={{
                      color: location.pathname.startsWith('/recruiter') ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 500
                    }}
                  >
                    Recruiter Portal
                  </Link>
                  <Link
                    to="/admin/analytics"
                    aria-current={location.pathname.startsWith('/admin') ? 'page' : undefined}
                    style={{
                      color: location.pathname.startsWith('/admin') ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 500
                    }}
                  >
                    Admin Portal
                  </Link>
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{user.firstName} {user.lastName}</div>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    background: user.role === 'Candidate' ? 'rgba(56, 189, 248, 0.15)' :
                      user.role === 'HiringManager' ? 'rgba(16, 185, 129, 0.15)' :
                        user.role === 'Admin' ? 'rgba(239, 68, 68, 0.15)' :
                          'rgba(168, 85, 247, 0.15)',
                    color: user.role === 'Candidate' ? '#38bdf8' :
                      user.role === 'HiringManager' ? '#10b981' :
                        user.role === 'Admin' ? '#ef4444' :
                          '#c084fc',
                    border: `1px solid ${user.role === 'Candidate' ? 'rgba(56, 189, 248, 0.3)' :
                        user.role === 'HiringManager' ? 'rgba(16, 185, 129, 0.3)' :
                          user.role === 'Admin' ? 'rgba(239, 68, 68, 0.3)' :
                            'rgba(168, 85, 247, 0.3)'
                      }`
                  }}>
                    {user.role === 'HiringManager' ? 'Hiring Mngr' : user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
