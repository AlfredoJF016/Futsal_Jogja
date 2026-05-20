import { useState, useEffect, useMemo } from 'react';
import { 
  Download, TrendingUp, Calendar as CalendarIcon, 
  Activity, ArrowLeft, Trash2, Search, Key, LogOut, 
  CheckCircle, XCircle, PlusCircle, Edit3, Ban, Unlock, 
  UserMinus, FileDown
} from 'lucide-react';
import { getAllBookings } from '../../data/venues';
import { exportToPDF } from '../../utils/reportPrinter';
import { getAdminActivities, clearAdminActivities, logAdminActivity } from '../../utils/activityLogger';

export default function AdminReports() {
  const [bookings, setBookings] = useState(() => getAllBookings());
  const [view, setView] = useState('reports'); // 'reports' | 'activities'
  
  // Activity state
  const [activities, setActivities] = useState(() => getAdminActivities());
  const [activitySearch, setActivitySearch] = useState('');

  // Storage listener for real-time bookings & activities synchronization
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'futsal_bookings' || event.key === null) {
        setBookings(getAllBookings());
      }
      if (event.key === 'admin_activities' || event.key === null) {
        setActivities(getAdminActivities());
      }
    };

    // Custom event listener for same-tab updates
    const handleActivitiesUpdated = () => {
      setActivities(getAdminActivities());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('admin_activities_updated', handleActivitiesUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('admin_activities_updated', handleActivitiesUpdated);
    };
  }, []);

  const stats = useMemo(() => {
    const totalTransactions = bookings.length;
    const validBookings = bookings.filter(b => b.status === 'valid');
    const invalidBookings = bookings.filter(b => b.status === 'invalid');
    
    const totalRevenue = validBookings.reduce((sum, b) => sum + (b.total || 0), 0);
    const averageRent = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
    const cancelRate = totalTransactions > 0 ? ((invalidBookings.length / totalTransactions) * 100).toFixed(1) : '0';

    return {
      totalRevenue,
      totalTransactions,
      averageRent,
      cancelRate
    };
  }, [bookings]);

  // Calculate daily trend for the last 14 days dynamically
  const last14Days = useMemo(() => {
    const days = [];
    const validBookings = bookings.filter(b => b.status === 'valid');
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      
      // format to match booking date (YYYY-MM-DD)
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const dayBookings = validBookings.filter(b => b.date === formattedDate);
      const dayRevenue = dayBookings.reduce((sum, b) => sum + (b.total || 0), 0);

      days.push({
        label: dateStr,
        formattedDate,
        revenue: dayRevenue
      });
    }
    return days;
  }, [bookings]);

  // Find max revenue for scaling chart bars
  const maxRevenue = useMemo(() => {
    const vals = last14Days.map(d => d.revenue);
    const max = Math.max(...vals);
    return max > 0 ? max : 150000; // default minimum ceiling
  }, [last14Days]);

  const handleExportPDF = () => {
    const summaryStats = [
      { label: 'Total Pendapatan', value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}` },
      { label: 'Total Transaksi', value: `${stats.totalTransactions} Booking` },
      { label: 'Rata-rata Sewa', value: `Rp ${stats.averageRent.toLocaleString('id-ID')}` },
      { label: 'Persentase Batal', value: `${stats.cancelRate}%` }
    ];

    exportToPDF({
      title: 'Laporan Finansial & Operasional JogjaFutsal',
      stats: summaryStats,
      bookingsData: bookings
    });
    
    logAdminActivity('export_pdf', 'Mengekspor laporan finansial & operasional ke file PDF');
  };

  const handleClearLogs = () => {
    if (window.confirm('Yakin ingin menghapus seluruh log aktivitas admin? Tindakan ini tidak bisa dibatalkan.')) {
      clearAdminActivities();
      logAdminActivity('delete_logs', 'Membersihkan seluruh log aktivitas admin');
      setActivities([]);
    }
  };

  // Filter activities based on search query
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const query = activitySearch.toLowerCase();
      return (
        act.description.toLowerCase().includes(query) ||
        act.adminName.toLowerCase().includes(query) ||
        act.adminEmail.toLowerCase().includes(query) ||
        act.actionType.toLowerCase().includes(query)
      );
    });
  }, [activities, activitySearch]);

  // Map actionType to Badge Styles & Icons
  const getActionBadge = (type) => {
    switch (type) {
      case 'login':
        return {
          label: 'LOGIN',
          icon: <Key size={12} />,
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
        };
      case 'logout':
        return {
          label: 'LOGOUT',
          icon: <LogOut size={12} />,
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
        };
      case 'confirm_booking':
        return {
          label: 'KONFIRMASI BOOKING',
          icon: <CheckCircle size={12} />,
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
        };
      case 'delete_booking':
        return {
          label: 'HAPUS BOOKING',
          icon: <XCircle size={12} />,
          className: 'bg-red-500/10 text-red-400 border-red-500/20'
        };
      case 'add_venue':
        return {
          label: 'TAMBAH LAPANGAN',
          icon: <PlusCircle size={12} />,
          className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.05)]'
        };
      case 'edit_venue':
        return {
          label: 'EDIT LAPANGAN',
          icon: <Edit3 size={12} />,
          className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.05)]'
        };
      case 'delete_venue':
        return {
          label: 'HAPUS LAPANGAN',
          icon: <Trash2 size={12} />,
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        };
      case 'block_user':
        return {
          label: 'BLOKIR AKUN',
          icon: <Ban size={12} />,
          className: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]'
        };
      case 'unblock_user':
        return {
          label: 'BUKA BLOKIR',
          icon: <Unlock size={12} />,
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
      case 'delete_user':
        return {
          label: 'HAPUS AKUN',
          icon: <UserMinus size={12} />,
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        };
      case 'export_pdf':
        return {
          label: 'EKSPOR PDF',
          icon: <FileDown size={12} />,
          className: 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.05)]'
        };
      default:
        return {
          label: type.toUpperCase(),
          icon: <Activity size={12} />,
          className: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        };
    }
  };

  return (
    <div className="animate-fade-in p-2 text-slate-200">
      
      {view === 'reports' ? (
        <>
          {/* Header Section */}
          <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Laporan & Analitik</h1>
              <p className="text-slate-400 text-sm mt-1">Ringkasan performa finansial dan operasional lapangan.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setView('activities')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] group"
              >
                <Activity size={16} className="text-cyan-400 transition-transform group-hover:scale-110" /> Aktivitas
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
              >
                <Download size={16} /> Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-6">Tren Pendapatan Harian (14 Hari Terakhir)</h2>
              <div className="h-64 flex items-end gap-2 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                </div>
                
                {/* Bars */}
                {last14Days.map((day, i) => {
                  const pct = (day.revenue / maxRevenue) * 75; // Cap at 75% height for labels
                  const heightPercent = pct > 5 ? pct : 5; // Minimum height for bars to be visible
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group z-10">
                      <div 
                        className="w-full max-w-[30px] bg-gradient-to-t from-blue-600/80 to-cyan-500/80 hover:from-blue-500 hover:to-cyan-400 rounded-t-md transition-all relative cursor-pointer" 
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                          Rp {day.revenue.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 whitespace-nowrap">{day.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-6 rounded-2xl shadow-xl border border-blue-500/20">
                <div className="text-white/80 text-sm font-semibold mb-2">Total Pendapatan</div>
                <div className="text-3xl font-extrabold text-white mb-2">
                  Rp {stats.totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">
                  <TrendingUp size={14} /> Naik 15% dari bulan lalu
                </div>
              </div>
              
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl flex-1">
                 <div className="text-slate-400 text-sm font-bold mb-4">Statistik Kunci</div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                      <span className="text-slate-300 font-medium">Total Transaksi</span>
                      <span className="font-bold text-white">{stats.totalTransactions} Booking</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                      <span className="text-slate-300 font-medium">Rata-rata Sewa</span>
                      <span className="font-bold text-white">Rp {stats.averageRent.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">Persentase Batal</span>
                      <span className="font-bold text-rose-400">{stats.cancelRate}%</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Rincian Transaksi Terbaru</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/20">
                    <th className="py-4 pl-6">Tanggal</th>
                    <th className="py-4 px-4">Deskripsi / Member</th>
                    <th className="py-4 px-4">Slot Waktu</th>
                    <th className="py-4 pr-6 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">Belum ada data transaksi booking.</td>
                    </tr>
                  ) : (
                    [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 pl-6 text-slate-300 flex items-center gap-2">
                          <CalendarIcon size={14} className="text-slate-500" /> {row.date}
                        </td>
                        <td className="py-4 px-4 text-white font-bold">
                          Booking {row.courtLabel} — <span className="text-xs text-slate-400 font-medium">{row.userEmail}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 font-semibold">{row.slot}</td>
                        <td className={`py-4 pr-6 font-extrabold text-right ${row.status === 'valid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          Rp {(row.total || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Header Section for Activity Log */}
          <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3.5">
                <Activity className="text-cyan-400 animate-pulse" size={30} /> Log Aktivitas Admin
              </h1>
              <p className="text-slate-400 text-sm mt-1">Riwayat lengkap segala tindakan administrator dari login hingga logout secara transparan.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setView('reports')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 border border-slate-800/85 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <ArrowLeft size={16} /> Kembali
              </button>
              <button 
                onClick={handleClearLogs}
                disabled={activities.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed text-rose-400 rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              >
                <Trash2 size={16} /> Hapus Log
              </button>
            </div>
          </div>

          {/* Search bar & statistics card */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder="Cari log tindakan..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200"
              />
            </div>
            <div className="text-xs text-slate-500 self-end md:self-center font-semibold bg-slate-900/30 border border-slate-800/40 px-3 py-1.5 rounded-lg">
              Total Entri: <span className="text-cyan-400 font-bold">{filteredActivities.length}</span> / {activities.length}
            </div>
          </div>

          {/* Activity Log Table */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/20">
                    <th className="py-4 pl-6">Tanggal & Waktu</th>
                    <th className="py-4 px-4">Tipe Aksi</th>
                    <th className="py-4 px-4">Administrator</th>
                    <th className="py-4 px-4">Deskripsi Aktivitas</th>
                    <th className="py-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                          <Activity size={32} className="text-slate-600 animate-pulse" />
                          <span>Belum ada riwayat aktivitas log.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((act) => {
                      const badge = getActionBadge(act.actionType);
                      const formattedTime = new Date(act.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      });

                      return (
                        <tr key={act.id} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors">
                          <td className="py-4.5 pl-6 text-slate-300 font-mono text-xs whitespace-nowrap">
                            {formattedTime}
                          </td>
                          <td className="py-4.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wide ${badge.className}`}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-4.5 px-4">
                            <div className="font-bold text-white text-xs">{act.adminName}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{act.adminEmail}</div>
                          </td>
                          <td className="py-4.5 px-4 text-slate-200 font-medium">
                            {act.description}
                          </td>
                          <td className="py-4.5 pr-6 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold">
                              Sukses
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
