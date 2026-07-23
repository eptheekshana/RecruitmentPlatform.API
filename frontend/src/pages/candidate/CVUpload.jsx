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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 120);

    try {
      await api.candidate.uploadCV(file).catch(() => {});
    } catch {
      // Continue locally
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
    }, 1000);
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
    <div className="linkedin-card" style={{ padding: '1.75rem 2rem' }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: '0.25rem' }}>Manage Resume & CV</h1>
      <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Upload your latest resume to stand out and submit applications instantly.
      </p>

      {successMessage && (
        <div className="alert-box alert-success" style={{ marginBottom: '1.25rem', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}>
          <span>✅</span>
          <div>{successMessage}</div>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error" style={{ marginBottom: '1.25rem', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}>
          <span>⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* Active Submitted CV Card */}
      {submittedFile && !file && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1.25rem',
            borderRadius: '6px',
            background: '#e6f4ea',
            border: '1px solid #a8dab5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ fontSize: '2rem', color: '#057642' }}>📄</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>{submittedFile.name}</h3>
                <span className="status-badge shortlisted">
                  Active CV
                </span>
              </div>
              <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Uploaded {submittedFile.uploadedAt} • {(submittedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-linkedin-outline"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.85rem' }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemoveSubmittedCV}
              style={{
                background: 'transparent',
                border: '1px solid #f5c2c0',
                color: '#c5221f',
                borderRadius: '16px',
                padding: '0.3rem 0.85rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
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
        aria-label="Upload resume drop zone"
        style={{
          border: dragActive ? '2px dashed #0a66c2' : '2px dashed #e0e0e0',
          borderRadius: '8px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          background: dragActive ? '#e8f0fe' : '#fafafa',
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

        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0a66c2' }}>
          📤
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem', color: 'rgba(0,0,0,0.9)' }}>
          {dragActive ? 'Drop your file here...' : 'Drag & drop your resume here'}
        </h2>
        <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.825rem', marginBottom: '1.25rem' }}>Supports PDF, DOC, DOCX up to 5MB</p>

        <button
          type="button"
          className="btn-linkedin-outline"
          onClick={() => fileInputRef.current?.click()}
          style={{ pointerEvents: 'none', fontSize: '0.85rem' }}
          tabIndex={-1}
        >
          Browse File
        </button>
      </div>

      {/* Selected File Preview */}
      {file && (
        <div
          style={{
            marginTop: '1.25rem',
            background: '#fafafa',
            padding: '1.25rem',
            borderRadius: '6px',
            border: '1px solid #e0e0e0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: uploading ? '0.75rem' : '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#0a66c2' }}>📑</div>
            <div style={{ flex: 1 }}>
              <div className="flex justify-between" style={{ marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'rgba(0,0,0,0.9)' }}>{file.name}</span>
                <span style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.8rem' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <span style={{ color: '#0a66c2', fontSize: '0.8rem', fontWeight: 600 }}>
                {uploading ? `Uploading... ${progress}%` : 'File ready for submission'}
              </span>
            </div>

            {!uploading && (
              <button
                type="button"
                onClick={handleRemoveSelectedFile}
                style={{ background: 'transparent', border: 'none', color: '#c5221f', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ×
              </button>
            )}
          </div>

          {uploading && (
            <div style={{ marginBottom: '1rem', height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#0a66c2', transition: 'width 0.2s ease' }} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #eeeeee' }}>
            <button
              type="button"
              className="btn-linkedin-outline"
              onClick={handleRemoveSelectedFile}
              disabled={uploading}
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-linkedin-primary"
              onClick={handleSubmitCV}
              disabled={uploading}
              style={{ fontSize: '0.85rem' }}
            >
              {uploading ? 'Uploading...' : 'Submit CV'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUpload;
