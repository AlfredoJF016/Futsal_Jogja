import { useEffect, useMemo, useState } from 'react';
import {
  Users, CalendarDays, TrendingUp, DollarSign,
  CheckCircle, Clock, MapPin, Activity, ArrowUpRight, ArrowDownRight,
  TrendingDown, Percent, Zap
} from 'lucide-react';
import { getAllBookings, getBookingStats, VENUES, normalizeDate } from '../../data/venues';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState(getAllBookings());

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'futsal_bookings' || event.key === null) {
        setBookings(getAllBookings());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const today = normalizeDate(new Date());
  const stats = useMemo(() => {
    const todayStats = getBookingStats(today);

    return [
      {
        label: 'Total Revenue',
        value: `Rp ${todayStats.totalRevenue.toLocaleString('id-ID')}`,
        increase: true,
        percentage: '+12.5%',
        icon: <DollarSign size={20} />,
        color: 'text-emerald-400',
        glow: 'shadow-emerald-500/10',
        bg: 'from-emerald-500/20 to-emerald-500/5',
        border: 'border-emerald-500/20'
      },
      {
        label: 'Total Booking',
        value: todayStats.bookingCount.toString(),
        increase: true,
        percentage: '+8.2%',
        icon: <CalendarDays size={20} />,
        color: 'text-blue-400',
        glow: 'shadow-blue-500/10',
        bg: 'from-blue-500/20 to-blue-500/5',
        border: 'border-blue-500/20'
      },
      {
        label: 'Active Users',
        value: todayStats.activeUsers.toString(),
        increase: true,
        percentage: '+15.3%',
        icon: <Users size={20} />,
        color: 'text-cyan-400',
        glow: 'shadow-cyan-500/10',
        bg: 'from-cyan-500/20 to-cyan-500/5',
        border: 'border-cyan-500/20'
      },
      {
        label: 'Occupancy Rate',
        value: `${todayStats.occupancyRate}%`,
        increase: false,
        percentage: '-2.4%',
        icon: <Percent size={20} />,
        color: 'text-rose-400',
        glow: 'shadow-rose-500/10',
        bg: 'from-rose-500/20 to-rose-500/5',
        border: 'border-rose-500/20'
      },
    ];
  }, [bookings, today]);

  const recentActivities = useMemo(() => {
    return bookings
      .slice(-4)
      .reverse()
      .map((booking) => ({
        user: booking.userEmail,
        action: `Booking ${booking.courtLabel} pada ${booking.date} ${booking.slot}`,
        time: booking.date === today ? 'Baru saja' : booking.date > today ? 'Mendatang' : 'Selesai',
        status: booking.date < today ? 'success' : 'success'
      }));
  }, [bookings, today]);

  const upcomingSchedules = useMemo(() => {
    return bookings
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot))
      .slice(0, 3)
      .map((booking) => ({
        court: `${booking.courtLabel} (${VENUES.find((venue) => venue.id === booking.venueId)?.type || 'Futsal'})`,
        time: booking.slot,
        user: booking.userEmail,
        occupancy: 'Booked'
      }));
  }, [bookings]);

  return (
    <div className="animate-fade-in flex flex-col gap-8">

      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Selamat Datang, Admin <Zap className="text-cyan-400 fill-cyan-400 animate-pulse" size={24} />
          </h1>
          <p className="text-slate-400 text-sm mt-1">Pantau analitik, keterisian lapangan, dan performa keuangan secara real-time.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-xs font-semibold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.35)]"></span>
              Keterisian lapangan: {stats[3].value}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-xs font-semibold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.35)]"></span>
              Booking hari ini: {stats[1].value}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-xs font-semibold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.35)]"></span>
              Active users: {stats[2].value}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-slate-900/60 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 transition-colors">
            <option>Hari Ini</option>
            <option>Minggu Ini</option>
            <option>Bulan Ini</option>
          </select>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full -mr-6 -mt-6"></div>

            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} ${stat.color} flex items-center justify-center border ${stat.border}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 bg-slate-950/40 border border-slate-800/80 px-2.5 py-1 rounded-full text-xs font-bold ${stat.color}`}>
                {stat.increase ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{stat.percentage}</span>
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
            </div>

            {/* Mini Sparkline Chart simulation */}
            <div className="flex items-end gap-1 mt-5 h-8">
              {[35, 55, 45, 75, 50, 90, 60].map((val, i) => (
                <div key={i} className="flex-1 bg-slate-950/20 rounded-t-sm h-full flex items-end">
                  <div className={`w-full bg-gradient-to-t ${stat.bg} rounded-t-sm transition-all duration-500 group-hover:opacity-100 opacity-60`} style={{ height: `${val}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Visual Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Booking Analytics Graph */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Tren Pemesanan & Pendapatan</h2>
              <p className="text-xs text-slate-400 mt-0.5">Analitik performa bulanan JogjaFutsal</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500"></span> Booking</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Revenue</div>
            </div>
          </div>

          {/* Graph Simulation */}
          <div className="flex-1 min-h-[260px] flex items-end justify-between gap-3 relative pt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
            </div>

            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
              const height1 = Math.floor(Math.random() * 60) + 25;
              const height2 = Math.floor(Math.random() * 50) + 15;
              return (
                <div key={month} className="flex-1 flex flex-col items-center group z-10">
                  <div className="w-full max-w-[20px] flex items-end gap-[2px] h-48 mb-2">
                    <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-400 transition-colors" style={{ height: `${height1}%` }}></div>
                    <div className="w-full bg-emerald-400 rounded-t-md hover:bg-emerald-300 transition-colors" style={{ height: `${height2}%` }}></div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart Widget */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Status Booking</h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribusi pemesanan saat ini</p>
          </div>

          <div className="flex justify-center items-center my-6">
            <div className="relative w-44 h-44 rounded-full border-[14px] border-[#081120] shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center"
              style={{ background: 'conic-gradient(#3b82f6 0% 50%, #34d399 50% 75%, #f59e0b 75% 90%, #f43f5e 90% 100%)' }}>
              <div className="w-28 h-28 bg-[#0F172A] rounded-full flex flex-col items-center justify-center shadow-lg border border-slate-800">
                <span className="text-3xl font-extrabold text-white">342</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Selesai</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-blue-500"></span><span className="text-xs font-semibold text-slate-300">Aktif (50%)</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-emerald-400"></span><span className="text-xs font-semibold text-slate-300">Selesai (25%)</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span><span className="text-xs font-semibold text-slate-300">Menunggu (15%)</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span><span className="text-xs font-semibold text-slate-300">Batal (10%)</span></div>
          </div>
        </div>

      </div>

      {/* Bottom Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming Schedule Panel */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Jadwal Mendatang</h2>
              <p className="text-xs text-slate-400 mt-0.5">Daftar pertandingan terjadwal berikutnya</p>
            </div>
            <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Lihat Semua</button>
          </div>

          <div className="space-y-4">
            {upcomingSchedules.map((schedule, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-slate-950/20 border border-slate-800/50 rounded-xl hover:bg-slate-950/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                  <div>
                    <div className="text-sm font-bold text-white">{schedule.court}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <Clock size={12} /> {schedule.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200">{schedule.user}</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{schedule.occupancy} Full</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Aktivitas Terbaru</h2>
            <p className="text-xs text-slate-400 mt-0.5">Log tindakan sistem real-time</p>
          </div>

          <div className="space-y-6 flex-1">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {idx !== recentActivities.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-[-16px] w-[1px] bg-gradient-to-b from-slate-800 to-transparent" />
                )}
                <div className={`w-8 h-8 rounded-xl bg-slate-950/50 flex items-center justify-center flex-shrink-0 z-10 border border-slate-800/80`}>
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${act.status === 'success' ? 'text-emerald-400 bg-emerald-400' : act.status === 'danger' ? 'text-rose-500 bg-rose-500' : 'text-amber-500 bg-amber-500'}`}></div>
                </div>
                <div className="pt-0.5">
                  <div className="text-sm font-bold text-slate-200">{act.user}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">{act.action}</div>
                  <div className="text-[10px] text-slate-500 mt-2 font-mono">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
