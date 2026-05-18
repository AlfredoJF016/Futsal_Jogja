import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const updateAuth = () => {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      setAuthUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateAuth();
    window.addEventListener('storage', updateAuth);
    return () => window.removeEventListener('storage', updateAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setAuthUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar glass-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo flex items-center">
          <Activity className="logo-icon text-primary" size={28} />
          <span className="font-bold text-xl ml-2">JogjaFutsal<span className="text-primary">.</span></span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Beranda</Link>
          <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>Cari Lapangan</Link>
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profil</Link>
        </div>
        <div className="navbar-actions">
          {authUser ? (
            <button className="btn btn-secondary flex items-center gap-2" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <User size={18} />
              <span>Masuk / Daftar</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
