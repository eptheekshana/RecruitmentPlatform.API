import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';

const CreateJob = () => {
  const { token, API_BASE_URL } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    requirements: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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
      const res = await fetch(`${API_BASE_URL}/jobpostings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          department: formData.department,
          location: formData.location,
          requirements: formData.requirements,
          description: formData.description
        })
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus({ type: 'success', message: 'Job posting published successfully!' });
        setTimeout(() => {
          navigate('/recruiter/applicants');
        }, 1000);
      } else {
        setFormStatus({ type: 'error', message: data.message || 'Failed to create job posting.' });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'An error occurred while publishing job posting.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Job Posting</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Publish a new position to attract top candidate talent.
      </p>

      {formStatus && (
        <div className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          <span>{formStatus.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{formStatus.message}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormField id="title" label="Job Title" error={errors.title} required>
          <input
            ref={titleRef}
            type="text"
            name="title"
            placeholder="e.g. Senior .NET Full-Stack Engineer"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <FormField id="department" label="Department" required>
            <select name="department" value={formData.department} onChange={handleChange} disabled={loading}>
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
              name="location"
              placeholder="e.g. Remote / New York / Colombo"
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
            name="requirements"
            placeholder="e.g. C#, ASP.NET Core, React, SQL"
            value={formData.requirements}
            onChange={handleChange}
            disabled={loading}
          />
        </FormField>

        <FormField id="description" label="Job Description" error={errors.description} required style={{ marginBottom: '2.5rem' }}>
          <textarea
            ref={descriptionRef}
            name="description"
            rows="6"
            placeholder="Detailed description of role responsibilities..."
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormField>

        <div className="flex justify-end gap-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing Job...' : 'Publish Position'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
