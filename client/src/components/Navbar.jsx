import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">LearnHub</Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        {user ? (
          <>
            <NavLink to={dashboardPath(user.role)}>Dashboard</NavLink>
            <span className="user-tag">{user.name} ({user.role})</span>
            <button className="btn small light" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
