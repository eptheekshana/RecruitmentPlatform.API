import React, { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth ? useAuth() : {};
  const [formData, setFormData] = useState({
    skills: 'React, Node.js, C#, SQL',
    experienceLevel: 'Senior',
    bio: 'Passionate software engineer building scalable web applications.',
    resumeUrl: ''
  });

  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.candidate.getProfile().catch(() => null);
      if (data) {
        setFormData({
          skills: data.skills || '',
          experienceLevel: data.experienceLevel || 'Mid',
          bio: data.bio || '',
          resumeUrl: data.resumeUrl || ''
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormStatus(null);

    try {
      await api.candidate.updateProfile(formData).catch(() => null);
      setFormStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setFormStatus({ type: 'error', message: 'An error occurred while saving profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="linkedin-card" style={{ padding: '1.75rem 2rem' }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.25rem' }}>Edit Profile & Experience</h1>
      <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Keep your background, skills, and summary up to date for candidate recommendations.
      </p>

      {formStatus && (
        <div className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}>
          <span>{formStatus.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{formStatus.message}</div>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'rgba(0,0,0,0.6)' }}>Loading profile details...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField id="firstName" label="First Name">
              <input type="text" className="form-input" value={user?.firstName || 'Sadewma'} disabled style={{ background: '#f8fafc' }} />
            </FormField>
            <FormField id="lastName" label="Last Name">
              <input type="text" className="form-input" value={user?.lastName || 'Marasinghe'} disabled style={{ background: '#f8fafc' }} />
            </FormField>
          </div>

          <FormField id="email" label="Email Address">
            <input type="email" className="form-input" value={user?.email || 'sadewma@gmail.com'} disabled style={{ background: '#f8fafc' }} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField id="experienceLevel" label="Experience Level">
              <select className="form-select" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level (2-4 years)</option>
                <option value="Senior">Senior Level (5+ years)</option>
                <option value="Lead">Lead / Executive</option>
              </select>
            </FormField>

            <FormField id="resumeUrl" label="Resume Document Link">
              <input
                type="text"
                className="form-input"
                name="resumeUrl"
                placeholder="https://example.com/resumes/my_resume.pdf"
                value={formData.resumeUrl}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <FormField id="skills" label="Featured Skills" hint="Comma-separated list (e.g. C#, ASP.NET Core, React, SQL)">
            <input
              type="text"
              className="form-input"
              name="skills"
              placeholder="e.g. C#, ASP.NET Core, React, SQLite"
              value={formData.skills}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="bio" label="About / Summary" style={{ marginBottom: '1.5rem' }}>
            <textarea
              className="form-textarea"
              name="bio"
              rows="5"
              placeholder="Summary of your professional background and goals..."
              value={formData.bio}
              onChange={handleChange}
            />
          </FormField>

          <div className="flex justify-end gap-3">
            <button type="submit" className="btn-linkedin-primary" disabled={saving} style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem' }}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
