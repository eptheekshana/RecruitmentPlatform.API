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
    <div className="container flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div className="linkedin-card" style={{ width: '100%', maxWidth: '380px', padding: '2rem 2.25rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Sign in</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>Stay updated on your professional world</p>
        </div>

        {formStatus && (
          <div
            className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'}`}
            role={formStatus.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
          >
            <div>{formStatus.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="email"
            label="Email"
            error={touched.email ? errors.email : ''}
            required
          >
            <input
              ref={emailInputRef}
              type="email"
              name="email"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              disabled={loading}
              className={`form-input ${touched.email && errors.email ? 'form-input-error' : ''}`}
            />
          </FormField>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="form-label" style={{ marginBottom: 0 }}>
                Password <span style={{ color: '#c5221f' }}>*</span>
              </label>
            </div>
            <input
              id="password"
              ref={passwordInputRef}
              type="password"
              name="password"
              placeholder=""
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              disabled={loading}
              className={`form-input ${touched.password && errors.password ? 'form-input-error' : ''}`}
            />
            {touched.password && errors.password && (
              <p className="form-error-message" role="alert" style={{ fontSize: '0.8rem' }}>
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-linkedin-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.65rem', fontSize: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-6" style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
          New to ApexRecruit?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Join now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
