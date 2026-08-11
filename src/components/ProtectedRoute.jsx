import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap any <Route element={...}> with this to require login.
 * If not logged in, redirect to /login and remember where the
 * user was trying to go, so we can send them back after login.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // could render a spinner here

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
