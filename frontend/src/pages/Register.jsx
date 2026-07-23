import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) {
        error = 'Full name is required.';
      } else if (value.trim().length < 2) {
        error = 'Full name must be at least 2 characters.';
      }
    } else if (name === 'email') {
      if (!value.trim()) {
        error = 'Email address is required.';
      } else if (!emailRegex.test(value.trim())) {
        error = 'Please enter a valid email address.';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required.';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters long.';
      } else if (!passwordRegex.test(value)) {
        error = 'Password must include 1 uppercase letter, 1 number, and 1 special symbol.';
      }
    }
    return error;
  };

  const validateForm = (data) => {
    const newErrors = {};
    const nameErr = validateField('name', data.name);
    if (nameErr) newErrors.name = nameErr;

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
    setTouched({ name: true, email: true, password: true });
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormStatus({ type: 'error', message: 'Please fix validation errors.' });
      if (validationErrors.name) {
        nameInputRef.current?.focus();
      } else if (validationErrors.email) {
        emailInputRef.current?.focus();
      } else if (validationErrors.password) {
        passwordInputRef.current?.focus();
      }
      return;
    }

    setLoading(true);
    setFormStatus(null);

    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];
    const role = formData.role === 'employer' ? 'Recruiter' : formData.role === 'hiringmanager' ? 'HiringManager' : 'Candidate';

    try {
      await register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        role
      });

      setFormStatus({ type: 'success', message: `Welcome to ApexRecruit! Redirecting to ${role} portal...` });

      setTimeout(() => {
        if (role === 'Candidate') {
          navigate('/candidate/jobs');
        } else if (role === 'HiringManager') {
          navigate('/hiring-manager/shortlist');
        } else {
          navigate('/recruiter/applicants');
        }
      }, 500);
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="container flex flex-col items-center justify-center fade-in" 
      style={{ 
        minHeight: 'calc(100vh - 120px)', 
        padding: '2.5rem 1rem', 
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
          maxWidth: '430px', 
          padding: '2.5rem 2.25rem', 
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1,
          margin: 0
        }}
      >
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', letterSpacing: '-0.025em' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
            Join ApexRecruit to manage jobs and candidates
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
            id="name"
            label="Full Name"
            error={touched.name ? errors.name : ''}
            required
          >
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              placeholder="Alex Rivera"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              disabled={loading}
              className={`form-input ${touched.name && errors.name ? 'form-input-error' : ''}`}
            />
          </FormField>

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
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              disabled={loading}
              className={`form-input ${touched.email && errors.email ? 'form-input-error' : ''}`}
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            hint="Min. 8 characters with 1 capital, 1 number, and 1 symbol"
            error={touched.password ? errors.password : ''}
            required
          >
            <input
              ref={passwordInputRef}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              disabled={loading}
              className={`form-input ${touched.password && errors.password ? 'form-input-error' : ''}`}
            />
          </FormField>

          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
              Join Platform As:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'var(--border-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} disabled={loading} style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }} />
                <span>Job Candidate / Applicant</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} disabled={loading} style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }} />
                <span>Talent Acquisition Recruiter</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <input type="radio" name="role" value="hiringmanager" checked={formData.role === 'hiringmanager'} onChange={handleChange} disabled={loading} style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }} />
                <span>Hiring Team Manager</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-linkedin-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.65rem 1.5rem', fontSize: '0.95rem', borderRadius: '30px', marginTop: '0.5rem' }}
          >
            {loading ? 'Registering account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6" style={{ fontSize: '0.875rem', color: 'var(--text-sub)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          Already on ApexRecruit?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
