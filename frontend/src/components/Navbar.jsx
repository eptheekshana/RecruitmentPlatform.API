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
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
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
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
            Recruit<span className="text-gradient">Hub</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            aria-current={location.pathname === '/' ? 'page' : undefined}
            style={{
              color: location.pathname === '/' ? 'var(--accent-primary)' : 'var(--text-secondary)',
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
                    color: location.pathname.startsWith('/candidate') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 500,
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Candidate Portal
                </Link>
              )}

              {(user.role === 'Recruiter' || user.role === 'Admin') && (
                <Link
                  to="/recruiter/applicants"
                  aria-current={location.pathname.startsWith('/recruiter') ? 'page' : undefined}
                  style={{
                    color: location.pathname.startsWith('/recruiter') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 500,
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Recruiter Portal
                </Link>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.firstName} {user.lastName}</div>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    background: user.role === 'Candidate' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(147, 51, 234, 0.1)',
                    color: user.role === 'Candidate' ? 'var(--accent-primary)' : '#9333ea',
                    border: `1px solid ${user.role === 'Candidate' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(147, 51, 234, 0.2)'}`
                  }}>
                    {user.role}
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
