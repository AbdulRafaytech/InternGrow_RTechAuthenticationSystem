import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SessionTimeoutModal() {
  const { sessionWarning, stayLoggedIn, logout, WARNING_COUNTDOWN_MS } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(WARNING_COUNTDOWN_MS / 1000);

  useEffect(() => {
    if (!sessionWarning) {
      setSecondsLeft(WARNING_COUNTDOWN_MS / 1000);
      return undefined;
    }
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionWarning, WARNING_COUNTDOWN_MS]);

  if (!sessionWarning) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="center-icon-badge">⏱</div>
        <h3>Still there?</h3>
        <p>You've been inactive for a while. For your security, you'll be signed out automatically.</p>
        <div className="countdown-ring">{secondsLeft}s</div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={logout}>Sign out</button>
          <button className="btn-primary" onClick={stayLoggedIn}>Stay signed in</button>
        </div>
      </div>
    </div>
  );
}
