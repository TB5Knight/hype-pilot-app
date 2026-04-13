import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthSpinner from './AuthSpinner';

/**
 * Wraps auth pages (login, signup) so already-logged-in users are redirected away.
 *
 * If the user arrived here after being bounced from a protected route,
 * location.state.from holds where they originally wanted to go — pass it
 * along so Login can redirect them there after a successful sign-in.
 */
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Block render until the initial session is resolved — prevents a flash
  // of the login page for users who are already authenticated.
  if (loading) return <AuthSpinner />;

  // Already logged in — send them to where they came from, or home.
  if (user) {
    const destination = location.state?.from?.pathname ?? '/';
    return <Navigate to={destination} replace />;
  }

  return children;
}
