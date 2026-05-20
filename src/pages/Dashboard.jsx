import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, Clock3, X, Key, Settings } from 'lucide-react';
import { getBookingsByUser, normalizeDate } from '../data/venues';
import './Dashboard.css';

import { getStoredUsers, saveUsers } from '../data/users';

export default function Dashboard() {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('booking');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      
      // Verify blocked status from user database
      const dbUser = getStoredUsers().find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
      if (dbUser && dbUser.status === 'diblokir') {
        const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
        const updated = activeSessions.filter(email => email !== parsed.email.toLowerCase());
        localStorage.setItem('active_sessions', JSON.stringify(updated));

        localStorage.removeItem('authUser');
        navigate('/login');
        return;
      }

      setAuthUser(parsed);
      setBookings(getBookingsByUser(parsed.email));
    } else {
      navigate('/login');
    }
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
    navigate('/');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!authUser) return;

    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.email.toLowerCase() === authUser.email.toLowerCase());
    
    if (userIndex === -1) {
      setErrorMsg('Pengguna tidak ditemukan.');
      return;
    }

    const dbUser = storedUsers[userIndex];
    const storedPwd = dbUser.password || 'user123';

    if (currentPassword !== storedPwd) {
      setErrorMsg('Kata sandi saat ini salah.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    // Save updated password
    storedUsers[userIndex].password = newPassword;
    saveUsers(storedUsers);

    setSuccessMsg('Kata sandi berhasil diperbarui!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const bookingsByUser = useMemo(() => {
    if (!authUser) return [];
    return [...bookings].sort((a, b) => (a.date === b.date ? a.slot.localeCompare(b.slot) : a.date.localeCompare(b.date)));
  }, [bookings, authUser]);

  const today = normalizeDate(new Date());
  const activeBookings = bookingsByUser.filter((booking) => booking.date >= today).slice(0, 3);
  const pastBookings = bookingsByUser.filter((booking) => booking.date < today).slice(-3).reverse();

  const activeBookingCount = activeBookings.length;
  const totalBookingsCount = bookingsByUser.length;
  const memberSince = authUser?.joined || 'Jan 2026';

  return (
    <div className="dashboard-page container py-10">
      <div className="flex justify-between items-center mb-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Saya</h1>
          <p className="text-muted">Selamat datang, <span className="text-primary font-semibold">{authUser?.name || 'Pengguna'}</span></p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-6 border-b border-[rgba(255,255,255,0.1)] mb-8 animate-fade-in">
        <button
          className={`pb-3 font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === 'booking' ? 'text-primary animate-pulse-subtle' : 'text-muted hover:text-white'
          }`}
          onClick={() => {
            setActiveTab('booking');
            setSuccessMsg('');
            setErrorMsg('');
          }}
        >
          <Calendar size={18} />
          Jadwal & Riwayat Booking
          {activeTab === 'booking' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary animate-fade-in" />
          )}
        </button>
        <button
          className={`pb-3 font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === 'settings' ? 'text-primary animate-pulse-subtle' : 'text-muted hover:text-white'
          }`}
          onClick={() => {
            setActiveTab('settings');
            setSuccessMsg('');
            setErrorMsg('');
          }}
        >
          <Settings size={18} />
          Pengaturan Akun
          {activeTab === 'settings' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary animate-fade-in" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8 dashboard-grid">
        <div className="col-span-2">
          {activeTab === 'booking' ? (
            <>
              <section className="mb-8 animate-fade-in delay-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock3 className="text-primary" size={24} /> Jadwal Mendatang
                </h2>
                
                {activeBookings.length > 0 ? (
                  <div className="space-y-4">
                    {activeBookings.map(booking => (
                      <div key={booking.id} className="glass-panel p-6 booking-card active">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className={`badge-status ${booking.status === 'valid' ? 'success' : 'danger'} mb-2`}>
                              {booking.status === 'valid' ? (
                                <>
                                  <CheckCircle size={14} /> Valid
                                </>
                              ) : (
                                <>
                                  <X size={14} /> Invalid
                                </>
                              )}
                            </div>
                            <h3 className="text-xl font-bold">{booking.venueName}</h3>
                            <p className="text-muted text-sm flex items-center gap-1 mt-1">
                              <MapPin size={14} /> {booking.venueLocation}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted">ID Booking</div>
                            <div className="font-bold">{booking.id}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-6 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-primary" size={18} />
                            <span className="font-semibold">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="text-primary" size={18} />
                            <span className="font-semibold">{booking.slot}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel p-8 text-center text-muted animate-fade-in">
                    Belum ada jadwal main futsal. Yuk booking sekarang!
                  </div>
                )}
              </section>

              <section className="animate-fade-in delay-200">
                <h2 className="text-xl font-bold mb-4">Riwayat Booking</h2>
                {pastBookings.length > 0 ? (
                  <div className="space-y-4 animate-fade-in">
                    {pastBookings.map(booking => (
                      <div key={booking.id} className="glass-panel p-5 booking-card opacity-75 hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">{booking.venueName}</h3>
                            <div className="text-sm text-muted flex gap-3 mt-1">
                              <span>{booking.date} • {booking.slot}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-primary">Rp {booking.total.toLocaleString('id-ID')}</div>
                            <div className="text-xs text-muted">Selesai</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel p-8 text-center text-muted animate-fade-in">
                    Belum ada riwayat booking sebelumnya.
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="glass-panel p-8 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Key className="text-primary animate-pulse-subtle" size={24} /> Ganti Kata Sandi
              </h2>
              
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 mb-6 text-sm flex items-center gap-2 animate-fade-in">
                  <CheckCircle size={18} className="text-emerald-500 animate-bounce" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-4 mb-6 text-sm flex items-center gap-2 animate-fade-in">
                  <X size={18} className="text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="form-group">
                  <label className="form-label font-semibold text-sm">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    className="form-input w-full"
                    placeholder="Masukkan kata sandi saat ini"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-semibold text-sm">Kata Sandi Baru</label>
                  <input
                    type="password"
                    className="form-input w-full"
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-semibold text-sm">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    className="form-input w-full"
                    placeholder="Masukkan kembali kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary px-6 flex items-center gap-2">
                  <Key size={16} /> Simpan Kata Sandi
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="col-span-1 animate-fade-in delay-300">
          <div className="glass-panel p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Statistik Profil</h2>
            <div className="space-y-4">
              <div className="stat-item flex justify-between items-center p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                <span className="text-muted">Total Main</span>
                <span className="font-bold text-xl">{totalBookingsCount}x</span>
              </div>
              <div className="stat-item flex justify-between items-center p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                <span className="text-muted">Booking Aktif</span>
                <span className="font-bold text-xl text-primary">{activeBookingCount}</span>
              </div>
              <div className="stat-item flex justify-between items-center p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                <span className="text-muted">Member Sejak</span>
                <span className="font-semibold">{memberSince}</span>
              </div>
            </div>

            <button className="btn btn-outline w-full justify-center mt-6 text-danger border-danger hover:bg-[rgba(239,68,68,0.1)] hover:shadow-none" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
