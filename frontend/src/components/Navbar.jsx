import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-icon">🏛️</span>
        <Link to="/dashboard" className="brand-text">Nagar<span>Seva</span></Link>
      </div>
      {user && (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/complaints">Complaints</Link>
          <Link to="/register-complaint">+ New</Link>
          <span className="nav-user">👤 {user.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      )}
    </nav>
  );
}