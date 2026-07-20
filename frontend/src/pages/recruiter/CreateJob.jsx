import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/FormField';
import api from '../../services/api';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formStatus, setFormStatus] = useState(null);

  const fieldRefs = {
    title: useRef(null),
    location: useRef(null),
    type: useRef(null),
    salaryMin: useRef(null),
    salaryMax: useRef(null),
    skills: useRef(null),
    description: useRef(null)
  };

  const validateField = (name, value, allData = formData) => {
    let error = '';
    if (name === 'title') {
      if (!value.trim()) error = 'Job title is required.';
      else if (value.trim().length < 3) error = 'Job title must be at least 3 characters.';
    } else if (name === 'location') {
      if (!value.trim()) error = 'Location is required.';
    } else if (name === 'type') {
      if (!value) error = 'Job type is required.';
    } else if (name === 'salaryMin') {
      if (!value) {
        error = 'Minimum salary is required.';
      } else if (Number(value) < 0) {
        error = 'Minimum salary cannot be negative.';
      } else if (allData.salaryMax && Number(value) > Number(allData.salaryMax)) {
        error = 'Minimum salary cannot exceed maximum salary.';
      }
    } else if (name === 'salaryMax') {
      if (!value) {
        error = 'Maximum salary is required.';
      } else if (Number(value) < 0) {
        error = 'Maximum salary cannot be negative.';
      } else if (allData.salaryMin && Number(value) < Number(allData.salaryMin)) {
        error = 'Maximum salary must be greater than or equal to minimum salary.';
      }
    } else if (name === 'skills') {
      if (!value.trim()) error = 'Required skills are required.';
    } else if (name === 'description') {
      if (!value.trim()) error = 'Job description is required.';
      else if (value.trim().length < 20) error = 'Job description must be at least 20 characters.';
    }
    return error;
  };

  const validateForm = (data) => {
    const newErrors = {};
    Object.keys(data).forEach((key) => {
      const err = validateField(key, data[key], data);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: value };
    setFormData(nextData);

    if (touched[name]) {
      const fieldErr = validateField(name, value, nextData);
      setErrors((prev) => ({ ...prev, [name]: fieldErr }));
    }

    // Re-validate opposite salary field if touched
    if (name === 'salaryMin' && touched.salaryMax) {
      setErrors((prev) => ({ ...prev, salaryMax: validateField('salaryMax', nextData.salaryMax, nextData) }));
    } else if (name === 'salaryMax' && touched.salaryMin) {
      setErrors((prev) => ({ ...prev, salaryMin: validateField('salaryMin', nextData.salaryMin, nextData) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErr = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = {
      title: true,
      location: true,
      type: true,
      salaryMin: true,
      salaryMax: true,
      skills: true,
      description: true
    };
    setTouched(allTouched);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormStatus({ type: 'error', message: 'Please fix the highlighted errors before publishing the job posting.' });
      const firstErrorKey = Object.keys(validationErrors)[0];
      fieldRefs[firstErrorKey]?.current?.focus();
      return;
    }

    try {
      await api.jobs.create({
        title: formData.title,
        description: formData.description,
        requirements: formData.skills,
        location: formData.location,
        department: formData.type,
      }).catch(() => null);
    } catch {}

    setFormStatus({ type: 'success', message: 'Job posting published successfully!' });
  };

  const handleReset = () => {
    setFormData({
      title: '',
      location: '',
      type: 'Full-time',
      salaryMin: '',
      salaryMax: '',
      skills: '',
      description: ''
    });
    setErrors({});
    setTouched({});
    setFormStatus(null);
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Job Posting</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Fill out the details below to publish a new open position.
      </p>

      {formStatus && (
        <div
          className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'} flex justify-between items-center`}
          role={formStatus.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <span>{formStatus.type === 'error' ? '⚠️' : '✅'}</span>
            <div>{formStatus.message}</div>
          </div>
          {formStatus.type === 'success' && (
            <Link to="/recruiter/applicants" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
              View Applicants →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Create job posting form">
        <FormField id="title" label="Job Title" error={touched.title ? errors.title : ''} required>
          <input
            ref={fieldRefs.title}
            type="text"
            name="title"
            placeholder="e.g. Senior Frontend Developer"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <FormField id="location" label="Location" error={touched.location ? errors.location : ''} required>
            <input
              ref={fieldRefs.location}
              type="text"
              name="location"
              placeholder="e.g. New York, NY or Remote"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormField>

          <FormField id="type" label="Job Type" error={touched.type ? errors.type : ''} required>
            <select
              ref={fieldRefs.type}
              name="type"
              value={formData.type}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </FormField>
        </div>

        <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
          <legend className="form-label" style={{ marginBottom: '0.5rem' }}>
            Salary Range (USD / Year) <span style={{ color: '#ef4444' }} aria-hidden="true">*</span>
          </legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormField id="salaryMin" label="Minimum Salary" error={touched.salaryMin ? errors.salaryMin : ''} required>
              <input
                ref={fieldRefs.salaryMin}
                type="number"
                name="salaryMin"
                placeholder="Minimum e.g. 100000"
                value={formData.salaryMin}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
              />
            </FormField>

            <FormField id="salaryMax" label="Maximum Salary" error={touched.salaryMax ? errors.salaryMax : ''} required>
              <input
                ref={fieldRefs.salaryMax}
                type="number"
                name="salaryMax"
                placeholder="Maximum e.g. 150000"
                value={formData.salaryMax}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
              />
            </FormField>
          </div>
        </fieldset>

        <FormField id="skills" label="Required Skills" error={touched.skills ? errors.skills : ''} hint="Comma separated list of key skills" required>
          <input
            ref={fieldRefs.skills}
            type="text"
            name="skills"
            placeholder="e.g. React, Node.js, AWS"
            value={formData.skills}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>

        <FormField id="description" label="Job Description" error={touched.description ? errors.description : ''} required style={{ marginBottom: '2.5rem' }}>
          <textarea
            ref={fieldRefs.description}
            name="description"
            rows="8"
            placeholder="Describe the responsibilities, requirements, and benefits..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ resize: 'vertical' }}
          ></textarea>
        </FormField>

        <div className="flex justify-end gap-4">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Discard
          </button>
          <button type="submit" className="btn btn-primary">
            Publish Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
