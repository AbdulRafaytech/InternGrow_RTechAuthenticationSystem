import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useAuth } from '../context/AuthContext';
import { getPasswordStrength } from '../utils/validation';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const fieldErrors = {};
    const strength = getPasswordStrength(password);
    if (strength.score < 2) fieldErrors.password = 'Password is too weak';
    if (confirmPassword !== password) fieldErrors.confirmPassword = 'Passwords do not match';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSubmitting(true);
    try {
      await resetPassword({ email, newPassword: password });
      setDone(true);
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <p className="eyebrow">Almost done</p>
      <h1>Set a new password</h1>
      <p className="subtitle">Choose a strong password you haven't used before.</p>

      {serverError && <div className="alert alert-error">⚠ {serverError}</div>}
      {done && <div className="alert alert-success">✓ Password updated. Redirecting to login…</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="New password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          placeholder="Create a new password"
          autoComplete="new-password"
        />
        <PasswordStrengthMeter password={password} />

        <div style={{ marginTop: 18 }}>
          <FormInput
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </div>

        <button className="btn-primary" disabled={submitting || done}>
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <p className="form-footer">
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
