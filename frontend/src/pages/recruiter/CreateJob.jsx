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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Info */}
      <div className="linkedin-card" style={{ padding: '1.25rem 1.75rem', margin: 0 }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Post a New Position</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem' }}>
          Reach qualified engineering, design, and management professionals across the network.
        </p>
      </div>

      {formStatus && (
        <div
          className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'} flex justify-between items-center`}
          role={formStatus.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', margin: 0 }}
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

      {/* Side-by-Side Editor & Preview Layout */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Editor Form Card */}
        <div className="linkedin-card" style={{ flex: '1 1 500px', margin: 0, padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Job Details Form
          </h2>
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
                placeholder="Detailed description of role responsibilities, benefits, and team culture..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormField>

            <div className="flex justify-end gap-3">
              <button type="submit" className="btn-linkedin-primary" disabled={loading} style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem' }}>
                {loading ? 'Publishing Job...' : 'Publish Job Posting'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Card Preview Widget */}
        <div style={{ flex: '1 1 360px', position: 'sticky', top: '70px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-sub)', letterSpacing: '0.5px' }}>
              Candidate View Preview
            </span>
            <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px' }}>
              ● Live Draft
            </span>
          </div>

          {/* Render mock Card list preview */}
          <div className="linkedin-card" style={{ margin: 0, padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
                {formData.title || 'Senior Position Title'}
              </h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: 500, marginBottom: '0.5rem' }}>
              🏢 {formData.department} • 📍 {formData.location || 'Remote'}
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {formData.requirements ? (
                formData.requirements.split(',').slice(0, 3).map((r, i) => (
                  <span key={i} className="linkedin-pill" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                    🛠️ {r.trim()}
                  </span>
                ))
              ) : (
                <>
                  <span className="linkedin-pill" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>🛠️ Skill A</span>
                  <span className="linkedin-pill" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>🛠️ Skill B</span>
                </>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-disabled)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              Date Posted: Today (Draft)
            </div>
          </div>

          {/* Render mock Details Pane preview */}
          <div className="linkedin-card" style={{ margin: 0, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Description Preview
            </h3>
            <div 
              style={{ 
                fontSize: '0.825rem', 
                color: 'var(--text-main)', 
                lineHeight: 1.5, 
                whiteSpace: 'pre-wrap', 
                maxHeight: '180px', 
                overflowY: 'auto' 
              }}
            >
              {formData.description || 'Description of responsibilities and benefits will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
