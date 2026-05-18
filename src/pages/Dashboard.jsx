import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, Clock3 } from 'lucide-react';
import { getBookingsByUser, normalizeDate } from '../data/venues';
import './Dashboard.css';

export default function Dashboard() {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setAuthUser(parsed);
      setBookings(getBookingsByUser(parsed.email));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const [bookings, setBookings] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    navigate('/');
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
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Saya</h1>
          <p className="text-muted">Selamat datang, <span className="text-primary font-semibold">{authUser?.name || 'Pengguna'}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 dashboard-grid">
        <div className="col-span-2">
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
                        <div className="badge-status success mb-2">
                          <CheckCircle size={14} /> Dikonfirmasi
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
              <div className="glass-panel p-8 text-center text-muted">
                Belum ada jadwal main futsal. Yuk booking sekarang!
              </div>
            )}
          </section>

          <section className="animate-fade-in delay-200">
            <h2 className="text-xl font-bold mb-4">Riwayat Booking</h2>
            <div className="space-y-4">
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
          </section>
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
