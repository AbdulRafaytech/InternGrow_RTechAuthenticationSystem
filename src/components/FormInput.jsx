import { useState } from 'react';

/**
 * Reusable text/password input with label + inline error.
 * Used by Login, Register, Forgot/Reset Password.
 */
export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="field">
      <label>{label}</label>
      <div className="field-input-row">
        <input
          type={resolvedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={error ? 'has-error' : ''}
        />
        {isPassword && (
          <button
            type="button"
            className="toggle-visibility"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        )}
      </div>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}
