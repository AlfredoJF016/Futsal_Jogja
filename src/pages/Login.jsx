import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, AlertTriangle } from 'lucide-react';
import { getStoredUsers, registerUser } from '../data/users';
import { logAdminActivity } from '../utils/activityLogger';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Custom Error states
  const [blockedError, setBlockedError] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const search = new URLSearchParams(location.search);
      const redirect = search.get('redirect');
      navigate(redirect || (parsed?.role === 'admin' ? '/admin' : '/profile'), { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBlockedError(false);
    setAuthError('');

    const trimmedEmail = email.trim().toLowerCase();

    // Read Admin credentials and settings
    const systemSettings = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('futsal_settings') || '{}') : {};
    const adminName = systemSettings.adminName || 'Admin Jogja';
    const adminEmail = (systemSettings.adminEmail || 'admin@jogjafutsal.com').trim().toLowerCase();
    const adminPwd = typeof window !== 'undefined' ? (localStorage.getItem('admin_password') || 'admin123') : 'admin123';

    // Check Admin Login
    if (isLogin && trimmedEmail === adminEmail && password === adminPwd) {
      const adminUser = { name: adminName, email: adminEmail, role: 'admin', avatar: systemSettings.adminAvatar || '' };
      localStorage.setItem('authUser', JSON.stringify(adminUser));
      logAdminActivity('login', 'Melakukan login ke Panel Admin');
      navigate('/admin');
      return;
    }

    // Get latest list of users from LocalStorage
    const storedUsers = getStoredUsers();

    // Check Blocked Status first
    const matchingUser = storedUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    if (matchingUser && matchingUser.status === 'diblokir') {
      setBlockedError(true);
      return;
    }

    // Handle Login
    if (isLogin) {
      const userPassword = matchingUser ? (matchingUser.password || 'user123') : 'user123';
      if (matchingUser && password === userPassword) {
        const emailLower = matchingUser.email.toLowerCase();
        const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        if (!activeSessions.includes(emailLower)) {
          activeSessions.push(emailLower);
          localStorage.setItem('active_sessions', JSON.stringify(activeSessions));
        }

        localStorage.setItem('authUser', JSON.stringify({ name: matchingUser.name, email: emailLower, role: 'user' }));
        const search = new URLSearchParams(location.search);
        navigate(search.get('redirect') || '/profile', { replace: true });
        return;
      }
      
      setAuthError('Email atau password salah. Pastikan data yang Anda masukkan benar.');
    } 
    // Handle Registration
    else {
      if (name.trim() && email.trim() && password.trim()) {
        // Register the user to the persistent user storage
        const registered = registerUser(name.trim(), email.trim(), password.trim());
        
        // Double check in case the freshly registered/fetched account is blocked
        if (registered.status === 'diblokir') {
          setBlockedError(true);
          return;
        }

        const emailLower = registered.email.toLowerCase();
        const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        if (!activeSessions.includes(emailLower)) {
          activeSessions.push(emailLower);
          localStorage.setItem('active_sessions', JSON.stringify(activeSessions));
        }

        localStorage.setItem('authUser', JSON.stringify({ name: registered.name, email: emailLower, role: 'user' }));
        const search = new URLSearchParams(location.search);
        navigate(search.get('redirect') || '/profile', { replace: true });
        return;
      }
      setAuthError('Harap lengkapi semua form pendaftaran.');
    }
  };

  return (
    <div className="login-page flex items-center justify-center">
      <div className="login-container glass-panel animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <Activity className="text-primary animate-pulse" size={40} />
          </Link>
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h1>
          <p className="text-muted text-sm">
            {isLogin 
              ? 'Silakan masuk untuk melanjutkan booking.' 
              : 'Daftar sekarang dan nikmati kemudahan booking lapangan futsal.'}
          </p>
        </div>

        {/* Blocked Account Error Box */}
        {blockedError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl p-4.5 mb-6 text-center animate-fade-in flex flex-col items-center gap-3">
            <AlertTriangle size={24} className="text-rose-500 animate-bounce" />
            <span className="font-semibold text-sm leading-relaxed">
              Akun Di Blokir Silahkan Hubungi Admin
            </span>
            <a 
              href="https://api.whatsapp.com/qr/VPQBHLTOPXOCN1?autoload=1&app_absent=0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-500/20"
            >
              Hubungi Admin via WhatsApp
            </a>
          </div>
        )}

        {/* Standard Auth Error Box */}
        {authError && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-3.5 mb-6 text-center text-xs font-semibold animate-fade-in">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input w-full pl-10"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setAuthError('');
                  }}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                className="form-input w-full pl-10" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setAuthError('');
                  setBlockedError(false);
                }}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                className="form-input w-full pl-10" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError('');
                }}
                required 
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end mb-4">
              <a href="#" className="text-sm text-primary hover:underline">Lupa Password?</a>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full justify-center mb-4 mt-2">
            {isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div className="text-center text-sm text-muted">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'} {' '}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setAuthError('');
              setBlockedError(false);
            }} 
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </button>
        </div>
      </div>
    </div>
  );
}
