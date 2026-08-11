import { useAuth } from '../context/AuthContext';
import SessionTimeoutModal from '../components/SessionTimeoutModal';

export default function Dashboard() {
  const { user, logout, SESSION_TIMEOUT_MS } = useAuth();

  return (
    <div className="dash-shell">
      <div className="dash-top">
        <div className="brand">
          <span className="brand-mark" />
          RTech
        </div>
        <button className="logout-btn" onClick={logout}>Log out</button>
      </div>

      <div className="dash-card">
        <span className="pill">● Protected route</span>
        <h1 style={{ marginTop: 16 }}>Welcome, {user?.name || 'there'} 👋</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          You only see this page because <code>ProtectedRoute</code> confirmed you're logged in.
          Try opening this URL in a private window without logging in — you'll be bounced to{' '}
          <code>/login</code>.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 20 }}>
          Idle for {SESSION_TIMEOUT_MS / 1000}s (no mouse/keyboard activity) and a session-timeout
          warning will appear automatically.
        </p>
      </div>

      <SessionTimeoutModal />
    </div>
  );
}
