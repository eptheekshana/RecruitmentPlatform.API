import React, { useState } from 'react';

const CVUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CV & Resume Upload</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Upload your latest resume to apply for jobs with one click.</p>

      <div 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed var(--accent-primary)' : '2px dashed var(--glass-border)',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          background: dragActive ? 'rgba(37, 99, 235, 0.05)' : 'rgba(15, 23, 42, 0.05)',
          transition: 'var(--transition-smooth)',
          position: 'relative'
        }}
      >
        <input 
          type="file" 
          id="cv-upload" 
          accept=".pdf,.doc,.docx" 
          onChange={handleChange} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
        />
        
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {dragActive ? 'Drop your file here...' : 'Drag & drop your resume here'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Supports PDF, DOC, DOCX up to 5MB</p>
        
        <button className="btn btn-secondary" style={{ pointerEvents: 'none' }}>Browse Files</button>
      </div>

      {file && (
        <div style={{ marginTop: '2rem', background: 'rgba(15, 23, 42, 0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>📑</div>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>{file.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            
            {uploading ? (
              <div style={{ width: '100%', height: '6px', background: 'rgba(15,23,42,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.2s ease' }}></div>
              </div>
            ) : (
              <div style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}>Upload complete</div>
            )}
          </div>
          {!uploading && (
            <button 
              onClick={() => setFile(null)} 
              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', fontSize: '1.25rem' }}
              title="Remove file"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tips for a great resume</h3>
        <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>Keep it concise and relevant to the roles you're applying for.</li>
          <li>Highlight your achievements with quantifiable metrics.</li>
          <li>Ensure your contact information is up to date.</li>
          <li>Use standard fonts and clear headings for readability.</li>
        </ul>
      </div>
    </div>
  );
};

export default CVUpload;
