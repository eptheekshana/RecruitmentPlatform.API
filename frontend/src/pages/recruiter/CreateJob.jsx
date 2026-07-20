import React, { useState } from 'react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job posting created:', formData);
    alert('Job posted successfully!');
    // Reset form after submission if needed
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Job Posting</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Fill out the details below to publish a new open position.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Job Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            className="form-input" 
            placeholder="e.g. Senior Frontend Developer" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              className="form-input" 
              placeholder="e.g. New York, NY or Remote" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="type">Job Type</label>
            <select 
              id="type" 
              name="type" 
              className="form-input" 
              value={formData.type} 
              onChange={handleChange} 
              required
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Salary Range</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>$</span>
            <input 
              type="number" 
              name="salaryMin" 
              className="form-input" 
              placeholder="Minimum" 
              value={formData.salaryMin} 
              onChange={handleChange} 
              required 
            />
            <span style={{ color: 'var(--text-secondary)' }}>to</span>
            <span style={{ color: 'var(--text-secondary)' }}>$</span>
            <input 
              type="number" 
              name="salaryMax" 
              className="form-input" 
              placeholder="Maximum" 
              value={formData.salaryMax} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="skills">Required Skills</label>
          <input 
            type="text" 
            id="skills" 
            name="skills" 
            className="form-input" 
            placeholder="e.g. React, Node.js, AWS (comma separated)" 
            value={formData.skills} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label className="form-label" htmlFor="description">Job Description</label>
          <textarea 
            id="description" 
            name="description" 
            className="form-input" 
            rows="8" 
            placeholder="Describe the responsibilities, requirements, and benefits..."
            value={formData.description} 
            onChange={handleChange} 
            required
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" className="btn btn-secondary">Discard</button>
          <button type="submit" className="btn btn-primary">Publish Job</button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
