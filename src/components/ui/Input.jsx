import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  success,
  loading = false,
  startIcon,
  endIcon,
  helperText,
  fullWidth = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const inputClass = `
    input-field
    ${error ? 'input-error' : ''}
    ${success ? 'input-success' : ''}
    ${loading ? 'input-loading' : ''}
    ${startIcon ? 'input-with-start-icon' : ''}
    ${endIcon ? 'input-with-end-icon' : ''}
    ${fullWidth ? 'input-full-width' : ''}
    ${className}
  `.trim();

  const containerClass = `
    input-container
    ${containerClassName}
  `.trim();

  return (
    <div className={containerClass}>
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {startIcon && (
          <div className="input-icon-start">{startIcon}</div>
        )}
        
        <input
          ref={ref}
          className={inputClass}
          disabled={loading || props.disabled}
          {...props}
        />
        
        {endIcon && (
          <div className="input-icon-end">{endIcon}</div>
        )}
        
        {loading && (
          <div className="input-loading-spinner"></div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`input-message ${error ? 'input-error-message' : 'input-helper-text'}`}>
          {error || helperText}
        </div>
      )}
      
      {success && (
        <div className="input-success-message">
          {success}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;