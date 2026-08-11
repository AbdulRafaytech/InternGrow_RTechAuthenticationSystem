import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const fieldErrors = validateLoginForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSubmitting(true);
    try {
      await login({ ...form, rememberMe });
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <p className="eyebrow">Welcome back</p>
      <h1>Log in to RTech</h1>
      <p className="subtitle">Enter your details to access your dashboard.</p>

      {serverError && <div className="alert alert-error">⚠ {serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <FormInput
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="row-between">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button className="btn-primary" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="form-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </AuthLayout>
  );
}
