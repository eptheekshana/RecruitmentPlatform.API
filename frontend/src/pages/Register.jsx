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

      setFormStatus({ type: 'success', message: `Welcome to RecruitHub! Redirecting to ${role} portal...` });

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
    <div className="container flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div className="linkedin-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem 2.25rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.25rem' }}>Make the most of your professional life</h1>
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
            id="name"
            label="Full Name"
            error={touched.name ? errors.name : ''}
            required
          >
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              placeholder=""
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

          <FormField
            id="password"
            label="Password (8+ characters)"
            error={touched.password ? errors.password : ''}
            required
          >
            <input
              ref={passwordInputRef}
              type="password"
              name="password"
              placeholder=""
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              disabled={loading}
              className={`form-input ${touched.password && errors.password ? 'form-input-error' : ''}`}
            />
          </FormField>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              I am joining as:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} disabled={loading} style={{ accentColor: '#0a66c2' }} />
                <span>Job Candidate / Applicant</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} disabled={loading} style={{ accentColor: '#0a66c2' }} />
                <span>Talent Recruiter</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="radio" name="role" value="hiringmanager" checked={formData.role === 'hiringmanager'} onChange={handleChange} disabled={loading} style={{ accentColor: '#0a66c2' }} />
                <span>Hiring Manager</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-linkedin-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.65rem', fontSize: '1rem' }}
          >
            {loading ? 'Agree & Join...' : 'Agree & Join'}
          </button>
        </form>

        <div className="text-center mt-6" style={{ fontSize: '0.875rem', color: 'rgba(0,0,0,0.6)' }}>
          Already on RecruitHub?{' '}
          <Link to="/login" style={{ color: '#0a66c2', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
