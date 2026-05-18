import { useState } from 'react';
import { Save, Bell, Shield, CreditCard, Monitor, User } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('umum');
  const [settings, setSettings] = useState({
    siteName: 'JogjaFutsal',
    contactEmail: 'admin@jogjafutsal.com',
    allowRegistration: true,
    maintenanceMode: false,
    currency: 'IDR',
    taxRate: '10'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="animate-fade-in p-2 text-slate-200 max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Pengaturan Sistem</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola konfigurasi platform JogjaFutsal Anda.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors font-semibold text-sm">
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

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
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-semibold text-sm border
                  ${activeTab === tab.id 
                    ? 'bg-slate-900/60 text-white border-slate-800' 
                    : 'text-slate-400 hover:bg-slate-900/30 border-transparent hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content Box */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
          {activeTab === 'umum' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800/60 pb-4">Pengaturan Umum</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Situs</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Kontak Utama</label>
                  <input 
                    type="email" 
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-colors text-sm"
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
                    <div className="font-bold text-white text-sm">Mode Perbaikan (Maintenance)</div>
                    <div className="text-xs text-slate-400 mt-1">Tutup akses website publik sementara waktu untuk pemeliharaan sistem.</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'pembayaran' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800/60 pb-4">Pengaturan Pembayaran</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mata Uang Default</label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-colors text-sm"
                  >
                    <option value="IDR">IDR - Indonesian Rupiah</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pajak / PPN (%)</label>
                  <input 
                    type="number" 
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {['notifikasi', 'keamanan', 'akun'].includes(activeTab) && (
            <div className="py-12 text-center text-slate-400">
              <div className="mb-4 flex justify-center opacity-50">
                {activeTab === 'notifikasi' && <Bell size={48} />}
                {activeTab === 'keamanan' && <Shield size={48} />}
                {activeTab === 'akun' && <User size={48} />}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 capitalize">Pengaturan {activeTab}</h3>
              <p className="text-sm">Opsi konfigurasi untuk modul ini belum dikembangkan pada versi demo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
