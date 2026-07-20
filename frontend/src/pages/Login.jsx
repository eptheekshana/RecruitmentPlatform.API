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
        error = 'Please enter a valid email address (e.g. name@example.com).';
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
      setFormStatus({ type: 'error', message: 'Please correct the errors in the form before submitting.' });
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
      setFormStatus({ type: 'success', message: `Welcome back, ${user.firstName}! Redirecting to ${user.role} portal...` });

      setTimeout(() => {
        if (user.role === 'Candidate') {
          navigate('/candidate/jobs');
        } else if (user.role === 'Recruiter' || user.role === 'Admin') {
          navigate('/recruiter/applicants');
        } else {
          navigate('/');
        }
      }, 600);
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center animate-fade-in" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue to RecruitHub</p>
        </div>

        {formStatus && (
          <div
            className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'}`}
            role={formStatus.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            <span>{formStatus.type === 'error' ? '⚠️' : '✅'}</span>
            <div>{formStatus.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-labelledby="login-heading">
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
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              disabled={loading}
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            error={touched.password ? errors.password : ''}
            required
            style={{ marginBottom: '2rem' }}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', float: 'right' }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                ref={passwordInputRef}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </FormField>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Demo Test Accounts:</p>
          <p>🧑‍💻 <strong>Candidate:</strong> bob@example.com / Candidate123!</p>
          <p>💼 <strong>Recruiter:</strong> recruiter@techsolutions.com / Recruiter123!</p>
        </div>

        <p className="text-center mt-8" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
