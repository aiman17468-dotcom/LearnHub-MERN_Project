import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Protects a page. "roles" is the list of roles that may open it.
function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="status">Loading...</p>;

  // Not logged in: go to login (and come back after login)
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  // Logged in but wrong role: access denied page
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
}

export default ProtectedRoute;
