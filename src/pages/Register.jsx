import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validation';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const fieldErrors = validateRegisterForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSubmitting(true);
    try {
      await register(form);
      navigate('/verify-email', { state: { email: form.email, name: form.name } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <p className="eyebrow">Get started</p>
      <h1>Create your account</h1>
      <p className="subtitle">Set up your workspace in under a minute.</p>

      {serverError && <div className="alert alert-error">⚠ {serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Full name"
          value={form.name}
          onChange={update('name')}
          error={errors.name}
          placeholder="Abdul Rafay"
          autoComplete="name"
        />
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
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <PasswordStrengthMeter password={form.password} />

        <div style={{ marginTop: 18 }}>
          <FormInput
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
        </div>

        <button className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="form-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
