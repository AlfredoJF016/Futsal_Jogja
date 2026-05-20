import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut } from 'lucide-react';
import { getStoredUsers } from '../data/users';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const updateAuth = () => {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      
      if (parsed) {
        if (parsed.role === 'user') {
          // Check if blocked in db
          const dbUser = getStoredUsers().find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
          if (dbUser && dbUser.status === 'diblokir') {
            const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
            const updated = activeSessions.filter(email => email !== parsed.email.toLowerCase());
            localStorage.setItem('active_sessions', JSON.stringify(updated));
            localStorage.removeItem('authUser');
            setAuthUser(null);
            navigate('/login');
            return;
          }

          // Otherwise, sync active sessions
          const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
          if (!activeSessions.includes(parsed.email.toLowerCase())) {
            activeSessions.push(parsed.email.toLowerCase());
            localStorage.setItem('active_sessions', JSON.stringify(activeSessions));
          }
        }
      }
      
      setAuthUser(parsed);
    };

    updateAuth();
    window.addEventListener('storage', updateAuth);
    return () => window.removeEventListener('storage', updateAuth);
  }, [navigate]);

  const handleLogout = () => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed && parsed.email) {
        const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        const updated = activeSessions.filter(email => email !== parsed.email.toLowerCase());
        localStorage.setItem('active_sessions', JSON.stringify(updated));
      }
    }
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
