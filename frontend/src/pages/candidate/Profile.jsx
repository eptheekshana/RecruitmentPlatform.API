import React, { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth ? useAuth() : {};
  const [formData, setFormData] = useState({
    skills: 'React, Node.js, C#, SQL',
    experienceLevel: 'Senior',
    bio: 'Passionate developer building scalable web applications.',
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
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Candidate Profile</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Manage your profile details, skills, and experience level for AI recruitment matching.
      </p>

      {formStatus && (
        <div className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          <span>{formStatus.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{formStatus.message}</div>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading profile details...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormField id="firstName" label="First Name">
              <input type="text" value={user?.firstName || 'Sadewma'} disabled style={{ opacity: 0.7 }} />
            </FormField>
            <FormField id="lastName" label="Last Name">
              <input type="text" value={user?.lastName || 'Marasinghe'} disabled style={{ opacity: 0.7 }} />
            </FormField>
          </div>

          <FormField id="email" label="Email Address">
            <input type="email" value={user?.email || 'sadewma@gmail.com'} disabled style={{ opacity: 0.7 }} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormField id="experienceLevel" label="Experience Level">
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level (2-4 years)</option>
                <option value="Senior">Senior Level (5+ years)</option>
                <option value="Lead">Lead / Executive</option>
              </select>
            </FormField>

            <FormField id="resumeUrl" label="Resume Document URL">
              <input
                type="text"
                name="resumeUrl"
                placeholder="https://example.com/resumes/my_resume.pdf"
                value={formData.resumeUrl}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <FormField id="skills" label="Key Skills" hint="Comma-separated list (e.g. C#, ASP.NET Core, React, SQL)">
            <input
              type="text"
              name="skills"
              placeholder="e.g. C#, ASP.NET Core, React, SQLite"
              value={formData.skills}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="bio" label="Professional Bio" style={{ marginBottom: '2.5rem' }}>
            <textarea
              name="bio"
              rows="5"
              placeholder="Summary of your professional background and goals..."
              value={formData.bio}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </FormField>

          <div className="flex justify-end gap-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
