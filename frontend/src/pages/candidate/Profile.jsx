import React, { useState, useRef } from 'react';
import FormField from '../../components/FormField';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: 'Sadewma',
    lastName: 'Marasinghe',
    email: 'sadewma@gmail.com',
    phone: '+94 70 571 3902',
    title: 'Senior Frontend Developer',
    location: 'Remote',
    bio: 'Passionate developer with 3+ years of experience building scalable web applications using React and Node.js.',
    skills: 'React, Node.js, TypeScript, CSS'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formStatus, setFormStatus] = useState(null);

  const fieldRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    title: useRef(null)
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'firstName') {
      if (!value.trim()) error = 'First name is required.';
      else if (value.trim().length < 2) error = 'First name must be at least 2 characters.';
    } else if (name === 'lastName') {
      if (!value.trim()) error = 'Last name is required.';
      else if (value.trim().length < 2) error = 'Last name must be at least 2 characters.';
    } else if (name === 'email') {
      if (!value.trim()) error = 'Email address is required.';
      else if (!emailRegex.test(value.trim())) error = 'Please enter a valid email address.';
    } else if (name === 'phone') {
      if (value.trim() && !phoneRegex.test(value.trim())) {
        error = 'Please enter a valid phone number (e.g. +1 555-123-4567).';
      }
    } else if (name === 'title') {
      if (!value.trim()) error = 'Professional title is required.';
    }
    return error;
  };

  const validateForm = (data) => {
    const newErrors = {};
    ['firstName', 'lastName', 'email', 'phone', 'title'].forEach((field) => {
      const err = validateField(field, data[field] || '');
      if (err) newErrors[field] = err;
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = { firstName: true, lastName: true, email: true, phone: true, title: true };
    setTouched(allTouched);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormStatus({ type: 'error', message: 'Please fix the highlighted errors before saving changes.' });
      const firstErrorKey = Object.keys(validationErrors)[0];
      fieldRefs[firstErrorKey]?.current?.focus();
      return;
    }

    setFormStatus({ type: 'success', message: 'Profile updated successfully!' });
    console.log('Profile saved:', formData);
  };

  const handleReset = () => {
    setErrors({});
    setTouched({});
    setFormStatus(null);
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile Management</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Update your personal details and professional information.
      </p>

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

      <form onSubmit={handleSubmit} noValidate aria-label="Candidate profile form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <FormField id="firstName" label="First Name" error={touched.firstName ? errors.firstName : ''} required>
            <input
              ref={fieldRefs.firstName}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="given-name"
            />
          </FormField>

          <FormField id="lastName" label="Last Name" error={touched.lastName ? errors.lastName : ''} required>
            <input
              ref={fieldRefs.lastName}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="family-name"
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <FormField id="email" label="Email Address" error={touched.email ? errors.email : ''} required>
            <input
              ref={fieldRefs.email}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
          </FormField>

          <FormField id="phone" label="Phone Number" error={touched.phone ? errors.phone : ''} hint="Optional e.g. +94 70 571 3902">
            <input
              ref={fieldRefs.phone}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="tel"
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <FormField id="title" label="Professional Title" error={touched.title ? errors.title : ''} required>
            <input
              ref={fieldRefs.title}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Senior Frontend Developer"
            />
          </FormField>

          <FormField id="location" label="Location" hint="City, Country or Remote">
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA or Remote"
            />
          </FormField>
        </div>

        <FormField id="skills" label="Skills (comma separated)" hint="e.g. React, Node.js, TypeScript, CSS">
          <input
            type="text"
            id="skills"
            name="skills"
            className="form-input"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Python, Design..."
          />
        </FormField>

        <FormField id="bio" label="Professional Bio" style={{ marginBottom: '2.5rem' }}>
          <textarea
            id="bio"
            name="bio"
            className="form-input"
            rows="5"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell employers about yourself..."
            style={{ resize: 'vertical' }}
          ></textarea>
        </FormField>

        <div className="flex justify-end gap-4">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
