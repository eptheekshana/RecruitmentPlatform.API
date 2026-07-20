import React, { useState, useRef } from 'react';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CVUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return 'No file selected.';

    const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return `Invalid file format (${fileExt}). Please upload a PDF, DOC, or DOCX document.`;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      return `File size (${sizeMB} MB) exceeds the maximum limit of 5 MB.`;
    }

    return null;
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    setError(null);
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }

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

  const handleDropzoneKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CV & Resume Upload</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Upload your latest resume to apply for jobs with one click.
      </p>

      {error && (
        <div className="alert-box alert-error" role="alert" aria-live="assertive">
          <span>⚠️</span>
          <div>{error}</div>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onKeyDown={handleDropzoneKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload resume drop zone. Press Enter or Space to select a file from your computer."
        style={{
          border: dragActive ? '2px dashed var(--accent-primary)' : '2px dashed var(--glass-border)',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          background: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(0, 0, 0, 0.2)',
          transition: 'var(--transition-smooth)',
          position: 'relative',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="cv-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
        />

        <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
          📄
        </div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {dragActive ? 'Drop your file here...' : 'Drag & drop your resume here'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Supports PDF, DOC, DOCX up to 5MB</p>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          style={{ pointerEvents: 'none' }}
          tabIndex={-1}
        >
          Browse Files
        </button>
      </div>

      {file && (
        <div
          role="region"
          aria-label="File upload status"
          style={{
            marginTop: '2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '2rem' }} aria-hidden="true">
            📑
          </div>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>{file.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            {uploading ? (
              <div>
                <div
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Uploading file progress"
                  style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}
                >
                  <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.2s ease' }}></div>
                </div>
                <div className="sr-only">Uploading: {progress}% complete</div>
              </div>
            ) : (
              <div style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }} role="status" aria-live="polite">
                Upload complete
              </div>
            )}
          </div>

          {!uploading && (
            <button
              type="button"
              onClick={handleRemoveFile}
              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', fontSize: '1.25rem' }}
              title="Remove file"
              aria-label={`Remove file ${file.name}`}
            >
              ×
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tips for a great resume</h2>
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
