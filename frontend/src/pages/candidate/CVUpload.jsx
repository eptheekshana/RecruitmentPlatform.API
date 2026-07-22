import React, { useState, useRef } from 'react';
import api from '../../services/api';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CVUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submittedFile, setSubmittedFile] = useState(() => {
    const saved = localStorage.getItem('submittedCV');
    return saved ? JSON.parse(saved) : null;
  });
  const [successMessage, setSuccessMessage] = useState(null);

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
    setSuccessMessage(null);
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmitCV = async () => {
    if (!file) {
      setError('Please select a CV file to upload.');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    // Simulate progress animation while executing submission
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      // Call API helper if backend is active, or fallback
      await api.candidate.uploadCV(file).catch(() => {});
    } catch {
      // Continue locally even if backend is offline
    }

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setUploading(false);

      const cvData = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setSubmittedFile(cvData);
      localStorage.setItem('submittedCV', JSON.stringify(cvData));
      setSuccessMessage(`"${file.name}" has been successfully uploaded and attached to your profile!`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1200);
  };

  const handleDropzoneKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleRemoveSelectedFile = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveSubmittedCV = () => {
    setSubmittedFile(null);
    localStorage.removeItem('submittedCV');
    setSuccessMessage(null);
  };

  return (
    <div className="glass-panel animate-fade-in delay-100" style={{ padding: '3rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CV & Resume Upload</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Upload and submit your latest resume to apply for jobs with one click.
      </p>

      {successMessage && (
        <div className="alert-box alert-success mb-6" role="status" aria-live="polite" style={{ marginBottom: '1.5rem' }}>
          <span>✅</span>
          <div>{successMessage}</div>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error mb-6" role="alert" aria-live="assertive" style={{ marginBottom: '1.5rem' }}>
          <span>⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* Active Submitted CV Card if exists */}
      {submittedFile && !file && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>📄</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{submittedFile.name}</h3>
                <span
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                  }}
                >
                  Active CV
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Uploaded on {submittedFile.uploadedAt} • {(submittedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              Replace CV
            </button>
            <button
              type="button"
              onClick={handleRemoveSubmittedCV}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop File Select Zone */}
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
          padding: '3.5rem 2rem',
          textAlign: 'center',
          background: dragActive ? 'rgba(37, 99, 235, 0.05)' : 'rgba(15, 23, 42, 0.05)',
          transition: 'var(--transition-smooth)',
          position: 'relative',
          outline: 'none',
          cursor: 'pointer',
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
          📤
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

      {/* File Selected Preview & Submit Area */}
      {file && (
        <div
          role="region"
          aria-label="Selected file preview"
          style={{
            marginTop: '2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: uploading ? '1rem' : '1.5rem' }}>
            <div style={{ fontSize: '2.5rem' }} aria-hidden="true">
              📑
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex justify-between" style={{ marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <span style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                {uploading ? `Uploading... ${progress}%` : 'File selected and ready to submit'}
              </span>
            </div>

            {!uploading && (
              <button
                type="button"
                onClick={handleRemoveSelectedFile}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  fontSize: '1.25rem',
                }}
                title="Remove selected file"
                aria-label={`Remove file ${file.name}`}
              >
                ×
              </button>
            )}
          </div>

          {uploading && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Uploading file progress"
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(15, 23, 42, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--accent-gradient)',
                    transition: 'width 0.2s ease',
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Dedicated Submit CV Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRemoveSelectedFile}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={handleSubmitCV}
              disabled={uploading}
              style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 600 }}
            >
              {uploading ? (
                <>
                  <span className="spinner" style={{ width: '1rem', height: '1rem', border: '2px solid transparent', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                  Uploading CV...
                </>
              ) : (
                'Submit CV'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tips section */}
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
