import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration attempt:', formData);
    // Add logic here later
  };

  return (
    <div className="container flex items-center justify-center animate-fade-in" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join RecruitHub today</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="form-input" 
              placeholder="John Doe" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="form-input" 
              placeholder="you@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">I am looking to...</label>
            <div className="flex gap-4">
              <label style={{ flex: 1, cursor: 'pointer', border: formData.role === 'candidate' ? '2px solid var(--accent-primary)' : '2px solid rgba(15,23,42,0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center', transition: 'var(--transition-smooth)', background: formData.role === 'candidate' ? 'rgba(37, 99, 235, 0.1)' : 'transparent' }}>
                <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} style={{ display: 'none' }} />
                <span style={{ fontWeight: 600, color: formData.role === 'candidate' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Find a job</span>
              </label>
              <label style={{ flex: 1, cursor: 'pointer', border: formData.role === 'employer' ? '2px solid var(--accent-primary)' : '2px solid rgba(15,23,42,0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center', transition: 'var(--transition-smooth)', background: formData.role === 'employer' ? 'rgba(37, 99, 235, 0.1)' : 'transparent' }}>
                <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} style={{ display: 'none' }} />
                <span style={{ fontWeight: 600, color: formData.role === 'employer' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Hire talent</span>
              </label>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}>
            Create Account
          </button>
        </form>
        
        <p className="text-center mt-8" style={{ color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
