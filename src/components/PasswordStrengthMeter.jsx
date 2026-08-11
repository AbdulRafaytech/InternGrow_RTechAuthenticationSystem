import { getPasswordStrength } from '../utils/validation';

const COLORS = ['#f0587a', '#f0587a', '#f5b544', '#5b7cfa', '#34d399'];

export default function PasswordStrengthMeter({ password }) {
  const { score, label, checks } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="strength-meter">
      <div className="strength-track">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{ background: i < score ? COLORS[score] : undefined }}
          />
        ))}
      </div>
      <div className="strength-label" style={{ color: COLORS[score] }}>
        {label}
      </div>
      <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--text-muted)' }}>
        {checks.map((c) => (
          <li key={c.label} style={{ color: c.pass ? 'var(--success)' : 'var(--text-muted)' }}>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
