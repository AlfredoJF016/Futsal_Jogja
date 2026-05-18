import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const sampleUsers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Budi Santoso', email: 'budi@santoso.id' },
    { name: 'Citra Kirana', email: 'citra@mail.com' },
    { name: 'Dimas Anggara', email: 'dimas@anggara.net' },
    { name: 'Eka Saputra', email: 'eka.saputra@outlook.com' },
  ];

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

    const authUser = { name: 'Admin Jogja', email: 'admin@jogjafutsal.com', role: 'admin' };
    if (isLogin && email === authUser.email && password === 'admin123') {
      localStorage.setItem('authUser', JSON.stringify(authUser));
      navigate('/admin');
      return;
    }

    const user = sampleUsers.find((item) => item.email === email);
    if (user && password === 'user123') {
      localStorage.setItem('authUser', JSON.stringify({ name: user.name, email: user.email, role: 'user' }));
      const search = new URLSearchParams(location.search);
      navigate(search.get('redirect') || '/profile', { replace: true });
      return;
    }

    if (!isLogin) {
      if (name.trim() && email.trim() && password.trim()) {
        localStorage.setItem('authUser', JSON.stringify({ name: name.trim(), email: email.trim(), role: 'user' }));
        const search = new URLSearchParams(location.search);
        navigate(search.get('redirect') || '/profile', { replace: true });
        return;
      }
    }

    alert('Email atau password salah. Gunakan password user123 untuk pengguna biasa atau buat akun baru.');
  };

  return (
    <div className="login-page flex items-center justify-center">
      <div className="login-container glass-panel animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <Activity className="text-primary" size={40} />
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
                  onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </button>
        </div>
      </div>
    </div>
  );
}
