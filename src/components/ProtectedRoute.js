import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthSpinner from './AuthSpinner';

/**
 * Wraps any route that requires authentication.
 *
 * While the session is still being resolved from storage, renders a spinner
 * instead of immediately redirecting — this prevents the "flash to login"
 * problem on hard refresh for users who are already signed in.
 *
 * When the session resolves as unauthenticated, the current location is saved
 * in state so Login can redirect the user back here after they sign in.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthSpinner />;

  if (!user) {
    // Save the attempted URL so Login can redirect back after sign-in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
