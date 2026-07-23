import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/FormField';
import api from '../../services/api';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    requirements: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      titleRef.current?.focus();
      return;
    }
    if (!formData.description.trim()) {
      setErrors({ description: 'Description is required' });
      descriptionRef.current?.focus();
      return;
    }

    setLoading(true);
    setFormStatus(null);

    try {
      await api.jobs.create({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        department: formData.department
      });

      setFormStatus({ type: 'success', message: 'Job posting published successfully!' });
      setFormData({
        title: '',
        department: 'Engineering',
        location: 'Remote',
        requirements: '',
        description: ''
      });
      setErrors({});
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || 'An error occurred while creating job posting.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="linkedin-card" style={{ padding: '1.75rem 2rem' }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.25rem' }}>Post a New Position</h1>
      <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Reach millions of qualified professionals across your network.
      </p>

      {formStatus && (
        <div
          className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'} flex justify-between items-center`}
          role={formStatus.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
        >
          <div className="flex items-center gap-2">
            <span>{formStatus.type === 'error' ? '⚠️' : '✅'}</span>
            <div>{formStatus.message}</div>
          </div>
          {formStatus.type === 'success' && (
            <Link to="/recruiter/applicants" className="btn-linkedin-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
              View Applicants →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormField id="title" label="Job Title" error={errors.title} required>
          <input
            ref={titleRef}
            type="text"
            className="form-input"
            name="title"
            placeholder="e.g. Senior .NET Full-Stack Engineer"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField id="department" label="Department" required>
            <select className="form-select" name="department" value={formData.department} onChange={handleChange} disabled={loading}>
              <option value="Engineering">Engineering</option>
              <option value="Design">Product Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </FormField>

          <FormField id="location" label="Location" required>
            <input
              type="text"
              className="form-input"
              name="location"
              placeholder="e.g. Remote / New York / San Francisco"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormField>
        </div>

        <FormField id="requirements" label="Required Skills & Qualifications" hint="Comma-separated list (e.g. C#, ASP.NET Core, React, SQL)">
          <input
            type="text"
            className="form-input"
            name="requirements"
            placeholder="e.g. C#, ASP.NET Core, React, SQL"
            value={formData.requirements}
            onChange={handleChange}
            disabled={loading}
          />
        </FormField>

        <FormField id="description" label="Job Description" error={errors.description} required style={{ marginBottom: '1.5rem' }}>
          <textarea
            ref={descriptionRef}
            className="form-textarea"
            name="description"
            rows="6"
            placeholder="Detailed description of role responsibilities..."
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormField>

        <div className="flex justify-end gap-3">
          <button type="submit" className="btn-linkedin-primary" disabled={loading} style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem' }}>
            {loading ? 'Publishing Job...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
