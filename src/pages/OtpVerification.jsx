import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 4;

export default function OtpVerification() {
  const { DEMO_OTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setError('Enter the full code');
      return;
    }
    if (code !== DEMO_OTP) {
      setError(`Incorrect code. (Demo code is ${DEMO_OTP})`);
      return;
    }
    setError('');
    navigate('/reset-password', { state: { email } });
  }

  return (
    <AuthLayout>
      <div className="center-icon-badge">🔐</div>
      <h1 className="text-center">Enter verification code</h1>
      <p className="subtitle text-center">
        We sent a {OTP_LENGTH}-digit code to <strong>{email}</strong>.
      </p>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="otp-row">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
            />
          ))}
        </div>

        <button className="btn-primary">Verify code</button>
      </form>

      <div className="resend-row" style={{ marginTop: 18 }}>
        {secondsLeft > 0 ? (
          <span>Resend code in {secondsLeft}s</span>
        ) : (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setSecondsLeft(30)}
            style={{ width: 'auto', padding: '6px 14px' }}
          >
            Resend code
          </button>
        )}
      </div>

      <p className="form-footer">
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
