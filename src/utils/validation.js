// Small, dependency-free validation helpers used across the auth forms.

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_REGEX.test(String(value).trim());
}

/**
 * Scores a password from 0-4 based on simple, explainable rules
 * (length, upper/lowercase mix, numbers, symbols). This is intentionally
 * simple — good enough for UI feedback, not a real security check.
 */
export function getPasswordStrength(password) {
  let score = 0;
  if (!password) {
    return { score: 0, label: 'Too weak', checks: [] };
  }

  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Upper & lower case letters', pass: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'At least one number', pass: /\d/.test(password) },
    { label: 'At least one symbol', pass: /[^A-Za-z0-9]/.test(password) },
  ];

  score = checks.filter((c) => c.pass).length;

  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score], checks };
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Password is required';

  return errors;
}

export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Enter your full name';

  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';

  const strength = getPasswordStrength(password);
  if (!password) errors.password = 'Password is required';
  else if (strength.score < 2) errors.password = 'Password is too weak';

  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';

  return errors;
}
