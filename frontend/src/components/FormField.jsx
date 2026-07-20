import React from 'react';

const FormField = ({
  id,
  label,
  error,
  required = false,
  hint,
  children,
  className = '',
  style = {}
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-group ${className}`} style={style}>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="form-label" style={{ marginBottom: 0 }}>
          {label}
          {required && (
            <span style={{ color: '#ef4444', marginLeft: '0.25rem' }} aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>

      {hint && (
        <p id={hintId} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.375rem' }}>
          {hint}
        </p>
      )}

      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id,
            'aria-invalid': !!error,
            'aria-describedby': describedBy,
            'aria-required': required ? 'true' : undefined,
            className: `${children.props.className || 'form-input'} ${error ? 'form-input-error' : ''}`.trim()
          })
        : children}

      {error && (
        <p id={errorId} className="form-error-message" role="alert">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
