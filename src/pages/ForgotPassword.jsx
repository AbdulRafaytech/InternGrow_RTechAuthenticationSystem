import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validation';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      // Real app: user gets an email with a link containing an OTP/token.
      navigate('/otp-verification', { state: { email, purpose: 'reset' } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <p className="eyebrow">Reset password</p>
      <h1>Forgot your password?</h1>
      <p className="subtitle">Enter the email linked to your account — we'll send a code to reset it.</p>

      {serverError && <div className="alert alert-error">⚠ {serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={error}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <button className="btn-primary" disabled={submitting}>
          {submitting ? 'Sending code…' : 'Send reset code'}
        </button>
      </form>

      <p className="form-footer">
        Remembered it? <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
