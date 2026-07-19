import React, { useState } from 'react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile saved:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile Management</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Update your personal details and professional information.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" className="form-input" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" className="form-input" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" className="form-input" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="title">Professional Title</label>
            <input type="text" id="title" name="title" className="form-input" value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="location">Location</label>
            <input type="text" id="location" name="location" className="form-input" value={formData.location} onChange={handleChange} placeholder="City, Country or Remote" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="skills">Skills (comma separated)</label>
          <input type="text" id="skills" name="skills" className="form-input" value={formData.skills} onChange={handleChange} placeholder="React, Python, Design..." />
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label className="form-label" htmlFor="bio">Professional Bio</label>
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
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
