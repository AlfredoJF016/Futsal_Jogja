import { useState, useEffect } from 'react';
import { Save, Bell, Shield, CreditCard, Monitor, User, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { logAdminActivity } from '../../utils/activityLogger';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('umum');
  
  const defaultSettings = {
    siteName: 'JogjaFutsal',
    contactEmail: 'admin@jogjafutsal.com',
    allowRegistration: true,
    maintenanceMode: false,
    currency: 'IDR',
    taxRate: '10',
    waNotifications: true,
    emailNotifications: true,
    soundAlerts: true,
    limitBaris: '10',
    adminName: 'Admin Jogja',
    adminEmail: 'admin@jogjafutsal.com',
    adminAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
  };

  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('futsal_settings');
        if (stored) {
          return { ...defaultSettings, ...JSON.parse(stored) };
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
    return defaultSettings;
  });

  // Password States
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // General Notification States
  const [generalSuccess, setGeneralSuccess] = useState(false);
  const [generalSuccessMsg, setGeneralSuccessMsg] = useState('');

  // Auto-dismiss success notifications
  useEffect(() => {
    if (generalSuccess) {
      const timer = setTimeout(() => setGeneralSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [generalSuccess]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setGeneralSuccess(false);
    setGeneralSuccessMsg('');

    try {
      localStorage.setItem('futsal_settings', JSON.stringify(settings));
      
      // Update authUser session if it's admin
      const authUser = JSON.parse(localStorage.getItem('authUser') || 'null');
      if (authUser && authUser.role === 'admin') {
        authUser.name = settings.adminName;
        authUser.email = settings.adminEmail;
        authUser.avatar = settings.adminAvatar;
        localStorage.setItem('authUser', JSON.stringify(authUser));
      }

      // Log the activity!
      logAdminActivity('update_settings', `Memperbarui pengaturan sistem (${activeTab.toUpperCase()})`);

      // Dispatch events to keep pages in sync
      window.dispatchEvent(new Event('storage'));

      setGeneralSuccessMsg('Pengaturan berhasil disimpan!');
      setGeneralSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminPasswordChange = (e) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    const storedAdminPwd = localStorage.getItem('admin_password') || 'admin123';

    if (currentPwd !== storedAdminPwd) {
      setPwdError('Kata sandi saat ini salah.');
      return;
    }

    if (newPwd.length < 6) {
      setPwdError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    // Save admin password
    localStorage.setItem('admin_password', newPwd);

    // Log the activity!
    logAdminActivity('change_password', 'Mengubah kata sandi akun admin');

    setPwdSuccess('Kata sandi admin berhasil diperbarui!');
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  return (
    <div className="animate-fade-in p-2 text-slate-200 max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Pengaturan Sistem</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola konfigurasi platform {settings.siteName} Anda.</p>
        </div>
        
        {/* Only show general save button if we are not on the Keamanan (password change) tab */}
        {activeTab !== 'keamanan' && (
          <button 
            onClick={handleSave} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold text-sm shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Save size={18} /> Simpan Perubahan
          </button>
        )}
      </div>

      {/* Floating Success Toast */}
      {generalSuccess && (
        <div className="fixed bottom-6 right-6 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-slide-in z-50 backdrop-blur-xl">
          <CheckCircle size={20} className="text-emerald-500 animate-bounce" />
          <span className="font-semibold text-sm">{generalSuccessMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-60 flex-shrink-0">
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'umum', label: 'Umum', icon: <Monitor size={18} /> },
              { id: 'pembayaran', label: 'Pembayaran', icon: <CreditCard size={18} /> },
              { id: 'notifikasi', label: 'Notifikasi', icon: <Bell size={18} /> },
              { id: 'keamanan', label: 'Keamanan', icon: <Shield size={18} /> },
              { id: 'akun', label: 'Akun Admin', icon: <User size={18} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPwdSuccess('');
                  setPwdError('');
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-semibold text-sm border
                  ${activeTab === tab.id 
                    ? 'bg-slate-900/60 text-white border-slate-800 shadow-md' 
                    : 'text-slate-400 hover:bg-slate-900/30 border-transparent hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content Box */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
          
          {/* Tab 1: UMUM */}
          {activeTab === 'umum' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800/60 pb-4 flex items-center gap-2">
                <Monitor className="text-blue-500" size={22} /> Pengaturan Umum
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Situs</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Kontak Utama</label>
                  <input 
                    type="email" 
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-950/20 rounded-xl border border-slate-800/60 hover:bg-slate-950/40 transition-colors">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={settings.allowRegistration}
                      onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.allowRegistration ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.allowRegistration ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Izinkan Pendaftaran Baru</div>
                    <div className="text-xs text-slate-400 mt-1">Buka akses pendaftaran untuk pengguna baru di website publik.</div>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-950/20 rounded-xl border border-slate-800/60 hover:bg-slate-950/40 transition-colors">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-amber-600' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Mode Perbaikan (Maintenance Mode)</div>
                    <div className="text-xs text-slate-400 mt-1">Tutup akses website publik sementara waktu untuk pemeliharaan sistem.</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: PEMBAYARAN */}
          {activeTab === 'pembayaran' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800/60 pb-4 flex items-center gap-2">
                <CreditCard className="text-emerald-500" size={22} /> Pengaturan Pembayaran
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mata Uang Default</label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  >
                    <option value="IDR">IDR - Indonesian Rupiah (Rp)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pajak / PPN (%)</label>
                  <input 
                    type="number" 
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: NOTIFIKASI */}
          {activeTab === 'notifikasi' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800/60 pb-4 flex items-center gap-2">
                <Bell className="text-purple-500" size={22} /> Pengaturan Notifikasi
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-950/20 rounded-xl border border-slate-800/60 hover:bg-slate-950/40 transition-colors">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={settings.waNotifications}
                      onChange={(e) => setSettings({...settings, waNotifications: e.target.checked})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.waNotifications ? 'bg-purple-600' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.waNotifications ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Notifikasi WhatsApp Otomatis</div>
                    <div className="text-xs text-slate-400 mt-1">Kirim rincian invoice dan status validasi langsung ke WA penyewa.</div>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-950/20 rounded-xl border border-slate-800/60 hover:bg-slate-950/40 transition-colors">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-purple-600' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Notifikasi Pembaruan Email</div>
                    <div className="text-xs text-slate-400 mt-1">Kirim email pemberitahuan setiap ada pemesanan masuk / dibatalkan.</div>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-950/20 rounded-xl border border-slate-800/60 hover:bg-slate-950/40 transition-colors">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={settings.soundAlerts}
                      onChange={(e) => setSettings({...settings, soundAlerts: e.target.checked})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.soundAlerts ? 'bg-purple-600' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.soundAlerts ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Efek Suara Real-time</div>
                    <div className="text-xs text-slate-400 mt-1">Bunyikan lonceng notifikasi audio secara realtime saat booking baru masuk.</div>
                  </div>
                </label>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Batas Tampilan Baris Laporan</label>
                  <input 
                    type="number" 
                    value={settings.limitBaris}
                    onChange={(e) => setSettings({...settings, limitBaris: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: KEAMANAN */}
          {activeTab === 'keamanan' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800/60 pb-4 flex items-center gap-2">
                <Shield className="text-rose-500 animate-pulse-subtle" size={22} /> Keamanan & Kata Sandi Admin
              </h2>

              {pwdSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 mb-4 text-sm flex items-center gap-2 animate-fade-in">
                  <CheckCircle size={18} className="text-emerald-500 animate-bounce" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              {pwdError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-4 mb-4 text-sm flex items-center gap-2 animate-fade-in">
                  <AlertTriangle size={18} className="text-rose-500" />
                  <span>{pwdError}</span>
                </div>
              )}

              <form onSubmit={handleAdminPasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kata Sandi Saat Ini</label>
                  <input 
                    type="password"
                    value={currentPwd}
                    onChange={(e) => { setCurrentPwd(e.target.value); setPwdError(''); }}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kata Sandi Baru</label>
                  <input 
                    type="password"
                    value={newPwd}
                    onChange={(e) => { setNewPwd(e.target.value); setPwdError(''); }}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors text-sm"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Konfirmasi Kata Sandi Baru</label>
                  <input 
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => { setConfirmPwd(e.target.value); setPwdError(''); }}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors text-sm"
                    placeholder="Masukkan kembali kata sandi baru"
                    required
                  />
                </div>

                <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold text-sm shadow-lg shadow-rose-500/20 active:scale-95">
                  <Key size={18} /> Perbarui Kata Sandi Admin
                </button>
              </form>

              {/* Danger Zone: Reset Database */}
              <div className="mt-12 pt-8 border-t border-rose-500/20">
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-rose-400 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} /> Zona Bahaya: Reset Database Aplikasi
                  </h3>
                  <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                    Tindakan ini akan menghapus seluruh data booking, pengguna kustom, pengaturan kustom, log aktivitas admin, dan mengembalikan semua data ke pengaturan awal (default). Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <button 
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin mereset seluruh database aplikasi? Semua data kustom Anda akan terhapus secara permanen.')) {
                        localStorage.removeItem('futsal_bookings');
                        localStorage.removeItem('futsal_venues');
                        localStorage.removeItem('futsal_users');
                        localStorage.removeItem('futsal_settings');
                        localStorage.removeItem('admin_password');
                        localStorage.removeItem('active_sessions');
                        localStorage.removeItem('admin_activities');
                        localStorage.removeItem('authUser');
                        
                        setPwdSuccess('Database berhasil direset ke setelan awal! Mengalihkan ke halaman utama...');
                        setTimeout(() => {
                          window.location.href = window.location.pathname; // Reloads app fresh
                        }, 2000);
                      }
                    }}
                    className="px-5 py-2.5 bg-rose-950/40 hover:bg-rose-900/30 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 rounded-xl font-semibold text-xs transition-colors"
                  >
                    Reset Semua Data Aplikasi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: AKUN ADMIN */}
          {activeTab === 'akun' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800/60 pb-4 flex items-center gap-2">
                <User className="text-cyan-500" size={22} /> Profil Akun Admin
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-950/20 rounded-2xl border border-slate-800/60">
                  <div className="relative">
                    <img 
                      src={settings.adminAvatar} 
                      alt="Admin Avatar Preview" 
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-800 p-1 bg-slate-900 shadow-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="text-sm font-bold text-white">Pilih Avatar Profil</div>
                    <div className="flex flex-wrap gap-3">
                      {[
                        'Felix',
                        'Aneka',
                        'Jack',
                        'Bella',
                        'Charlie',
                        'Daisy'
                      ].map(seed => {
                        const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                        return (
                          <button
                            key={seed}
                            type="button"
                            onClick={() => setSettings({...settings, adminAvatar: url})}
                            className={`p-1 rounded-xl transition-all duration-200 border-2 
                              ${settings.adminAvatar === url ? 'border-cyan-500 bg-slate-850 shadow-md scale-105' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'}`}
                          >
                            <img src={url} alt={seed} className="w-10 h-10 rounded-lg" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Lengkap Admin</label>
                    <input 
                      type="text" 
                      value={settings.adminName}
                      onChange={(e) => setSettings({...settings, adminName: e.target.value})}
                      className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Admin</label>
                    <input 
                      type="email" 
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                      className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
