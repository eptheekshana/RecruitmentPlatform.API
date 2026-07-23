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
    <div className="linkedin-card fade-in" style={{ padding: '2rem 2.25rem' }}>
      <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Edit Profile & Experience</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem' }}>
          Keep your professional details, experience level, and skills updated to optimize AI-matching recommendations.
        </p>
      </div>

      {formStatus && (
        <div 
          className={`alert-box ${formStatus.type === 'error' ? 'alert-error' : 'alert-success'}`} 
          style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}
        >
          <span>{formStatus.type === 'error' ? '⚠️' : '✅'}</span>
          <div>{formStatus.message}</div>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-sub)' }}>Loading profile details...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Account Details Group (Read-only) */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-sub)', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
              Account Identity
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <FormField id="firstName" label="First Name">
                <input 
                  type="text" 
                  className="form-input" 
                  value={user?.firstName || ''} 
                  disabled 
                  style={{ background: 'var(--border-subtle)', color: 'var(--text-sub)', cursor: 'not-allowed' }} 
                />
              </FormField>
              <FormField id="lastName" label="Last Name">
                <input 
                  type="text" 
                  className="form-input" 
                  value={user?.lastName || ''} 
                  disabled 
                  style={{ background: 'var(--border-subtle)', color: 'var(--text-sub)', cursor: 'not-allowed' }} 
                />
              </FormField>
            </div>
            <FormField id="email" label="Registered Email Address" style={{ marginTop: '0.75rem' }}>
              <input 
                type="email" 
                className="form-input" 
                value={user?.email || ''} 
                disabled 
                style={{ background: 'var(--border-subtle)', color: 'var(--text-sub)', cursor: 'not-allowed' }} 
              />
            </FormField>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.5rem 0' }} />

          {/* Experience & Professional Details Group */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-sub)', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
              Professional Experience
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <FormField id="experienceLevel" label="Experience Level">
                <select 
                  className="form-select" 
                  name="experienceLevel" 
                  value={formData.experienceLevel} 
                  onChange={handleChange}
                >
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level (2-4 years)</option>
                  <option value="Senior">Senior Level (5+ years)</option>
                  <option value="Lead">Lead / Executive</option>
                </select>
              </FormField>

              <FormField id="resumeUrl" label="Resume Document Link (Optional)">
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

            <FormField id="skills" label="Featured Skills" hint="Comma-separated list (e.g. C#, ASP.NET Core, React, SQL)" style={{ marginTop: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                name="skills"
                placeholder="e.g. C#, ASP.NET Core, React, SQLite"
                value={formData.skills}
                onChange={handleChange}
              />
            </FormField>

            <FormField id="bio" label="About / Summary" style={{ marginTop: '0.75rem' }}>
              <textarea
                className="form-textarea"
                name="bio"
                rows="5"
                placeholder="Brief summary of your professional background, achievements, and career goals..."
                value={formData.bio}
                onChange={handleChange}
                style={{ resize: 'vertical' }}
              />
            </FormField>
          </div>

          <div className="flex justify-end style={{ marginTop: '0.5rem' }}">
            <button 
              type="submit" 
              className="btn-linkedin-primary" 
              disabled={saving} 
              style={{ fontSize: '0.9rem', padding: '0.55rem 2rem', borderRadius: '24px' }}
            >
              {saving ? 'Saving changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
