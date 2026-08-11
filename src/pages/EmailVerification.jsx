import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function EmailVerification() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const [status, setStatus] = useState('idle'); // idle | verifying | done
  const [resent, setResent] = useState(false);

  // Simulates clicking the verification link from an email.
  // Task scope is UI only — a real backend would send the actual email.
  async function handleVerify() {
    setStatus('verifying');
    await verifyEmail(email);
    setStatus('done');
    setTimeout(() => navigate('/login'), 1200);
  }

  return (
    <AuthLayout>
      <div className="center-icon-badge">✉️</div>
      <h1 className="text-center">Verify your email</h1>
      <p className="subtitle text-center">
        We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
      </p>

      {status === 'done' && (
        <div className="alert alert-success">✓ Email verified! Redirecting to login…</div>
      )}
      {resent && status === 'idle' && (
        <div className="alert alert-info">Verification email resent.</div>
      )}

      <button className="btn-primary" onClick={handleVerify} disabled={status !== 'idle'}>
        {status === 'verifying' ? 'Verifying…' : 'Simulate clicking email link'}
      </button>

      <button
        type="button"
        className="btn-secondary"
        style={{ marginTop: 12 }}
        onClick={() => setResent(true)}
      >
        Resend verification email
      </button>

      <p className="form-footer">
        Wrong email? <Link to="/register">Go back</Link>
      </p>
    </AuthLayout>
  );
}
