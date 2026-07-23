import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email address is required.';
      } else if (!emailRegex.test(value.trim())) {
        error = 'Please enter a valid email address.';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required.';
      }
    }
    return error;
  };

  const validateForm = (data) => {
    const newErrors = {};
    const emailErr = validateField('email', data.email);
    if (emailErr) newErrors.email = emailErr;

    const passwordErr = validateField('password', data.password);
    if (passwordErr) newErrors.password = passwordErr;

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldErr = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormStatus({ type: 'error', message: 'Please fix form validation issues.' });
      if (validationErrors.email) {
        emailInputRef.current?.focus();
      } else if (validationErrors.password) {
        passwordInputRef.current?.focus();
      }
      return;
    }

    setLoading(true);
    setFormStatus(null);

    try {
      const user = await login(formData.email, formData.password);
      setFormStatus({ type: 'success', message: `Welcome back, ${user.firstName}!` });

      setTimeout(() => {
        if (user.role === 'Candidate') {
          navigate('/candidate/jobs');
        } else if (user.role === 'Recruiter') {
          navigate('/recruiter/applicants');
        } else if (user.role === 'HiringManager') {
          navigate('/hiring-manager/shortlist');
        } else if (user.role === 'Admin') {
          navigate('/admin/analytics');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || 'Sign in failed. Check your email & password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="container flex flex-col items-center justify-center fade-in" 
      style={{ 
        minHeight: 'calc(100vh - 120px)', 
        padding: '2rem 1rem', 
        position: 'relative' 
      }}
    >
      {/* Background Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div 
        className="linkedin-card" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '2.5rem 2.25rem', 
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1,
          margin: 0
        }}
      >
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', letterSpacing: '-0.025em' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
            Stay updated on your professional world
          </p>
        </div>

        {formStatus && (
          <div
            className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'}`}
            role={formStatus.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}
          >
            <div>{formStatus.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField
            id="email"
            label="Email Address"
            error={touched.email ? errors.email : ''}
            required
          >
            <input
              ref={emailInputRef}
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              disabled={loading}
              className={`form-input ${touched.email && errors.email ? 'form-input-error' : ''}`}
            />
          </FormField>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label htmlFor="password" className="form-label" style={{ marginBottom: 0 }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
            </div>
            <input
              id="password"
              ref={passwordInputRef}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              disabled={loading}
              className={`form-input ${touched.password && errors.password ? 'form-input-error' : ''}`}
            />
            {touched.password && errors.password && (
              <p className="form-error-message" role="alert" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-linkedin-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.65rem 1.5rem', fontSize: '0.95rem', borderRadius: '30px', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-6" style={{ fontSize: '0.875rem', color: 'var(--text-sub)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          New to ApexRecruit?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Join now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
