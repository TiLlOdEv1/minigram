import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    premium: 'btn-premium',
    verified: 'btn-verified',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg',
  };

  const buttonClass = `
    btn 
    ${variantClasses[variant] || variantClasses.primary} 
    ${sizeClasses[size] || sizeClasses.medium}
    ${loading ? 'btn-loading' : ''}
    ${disabled ? 'btn-disabled' : ''}
    ${fullWidth ? 'btn-full-width' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-loading-spinner"></span>
      )}
      
      {!loading && startIcon && (
        <span className="btn-icon-start">{startIcon}</span>
      )}
      
      <span className="btn-content">{children}</span>
      
      {!loading && endIcon && (
        <span className="btn-icon-end">{endIcon}</span>
      )}
    </button>
  );
};

export default Button;