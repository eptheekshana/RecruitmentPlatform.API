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
        error = 'Password must include at least 1 uppercase letter, 1 number, and 1 special character.';
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
      setFormStatus({ type: 'error', message: 'Please fix the highlighted errors before creating your account.' });
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
      const user = await register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        role
      });

      setFormStatus({ type: 'success', message: `Account created successfully! Redirecting to ${role} portal...` });

      setTimeout(() => {
        if (role === 'Candidate') {
          navigate('/candidate/jobs');
        } else if (role === 'HiringManager') {
          navigate('/hiring-manager/shortlist');
        } else {
          navigate('/recruiter/applicants');
        }
      }, 600);
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center animate-fade-in" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join RecruitHub today</p>
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
              placeholder="Sadewma Marasinghe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              disabled={loading}
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
            hint="Must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special symbol."
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
            />
          </FormField>

          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            <legend className="form-label" style={{ marginBottom: '0.75rem' }}>
              I am looking to... <span style={{ color: '#ef4444' }} aria-hidden="true">*</span>
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'block', cursor: 'pointer', border: formData.role === 'candidate' ? '2px solid var(--accent-primary)' : '2px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', transition: 'var(--transition-smooth)', background: formData.role === 'candidate' ? 'rgba(37, 99, 235, 0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} disabled={loading} style={{ accentColor: 'var(--accent-primary)', width: '1.1rem', height: '1.1rem' }} />
                  <span style={{ fontWeight: 600, color: formData.role === 'candidate' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Find a job (Candidate)</span>
                </div>
              </label>

              <label style={{ display: 'block', cursor: 'pointer', border: formData.role === 'employer' ? '2px solid var(--accent-primary)' : '2px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', transition: 'var(--transition-smooth)', background: formData.role === 'employer' ? 'rgba(37, 99, 235, 0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} disabled={loading} style={{ accentColor: 'var(--accent-primary)', width: '1.1rem', height: '1.1rem' }} />
                  <span style={{ fontWeight: 600, color: formData.role === 'employer' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Hire talent (Recruiter)</span>
                </div>
              </label>

              <label style={{ display: 'block', cursor: 'pointer', border: formData.role === 'hiringmanager' ? '2px solid var(--accent-primary)' : '2px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', transition: 'var(--transition-smooth)', background: formData.role === 'hiringmanager' ? 'rgba(37, 99, 235, 0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="radio" name="role" value="hiringmanager" checked={formData.role === 'hiringmanager'} onChange={handleChange} disabled={loading} style={{ accentColor: 'var(--accent-primary)', width: '1.1rem', height: '1.1rem' }} />
                  <span style={{ fontWeight: 600, color: formData.role === 'hiringmanager' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Evaluate candidates (Hiring Manager)</span>
                </div>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
