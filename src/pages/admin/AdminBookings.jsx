import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Check, X, Calendar, Clock, MapPin } from 'lucide-react';
import { getAllBookings, VENUES, normalizeDate } from '../../data/venues';

export default function AdminBookings() {
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

  return (
    <div className="animate-fade-in p-2 text-slate-200">
      
      {/* Header section */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Daftar Pemesanan</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola seluruh transaksi pemesanan lapangan futsal secara real-time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari ID Booking atau Email..." 
              className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/50 text-slate-300 rounded-xl text-sm font-semibold transition-colors shrink-0">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Table Data Panel */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/20">
                <th className="py-4 pl-6">ID / Tanggal</th>
                <th className="py-4 px-4">Pemesan</th>
                <th className="py-4 px-4">Lapangan & Waktu</th>
                <th className="py-4 px-4">Total Harga</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">Belum ada booking saat ini.</td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const today = normalizeDate(new Date());
                  const status = booking.date < today ? 'Completed' : booking.date === today ? 'Active' : 'Pending';
                  const statusClass = status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10'
                    : status === 'Active'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10';

                  return (
                    <tr key={booking.id} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors group">
                      <td className="py-4.5 pl-6">
                        <div className="font-bold text-white font-mono">{booking.id}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5"><Calendar size={12} /> {booking.date}</div>
                      </td>
                      <td className="py-4.5 px-4">
                        <div className="font-bold text-slate-200">{booking.userEmail}</div>
                        <div className="text-xs text-slate-500 mt-1">{booking.venueId}</div>
                      </td>
                      <td className="py-4.5 px-4">
                        <div className="font-semibold text-slate-300 flex items-center gap-1.5"><MapPin size={12} className="text-cyan-400" /> {booking.courtLabel}</div>
                        <div className="text-xs text-cyan-400 mt-1 font-semibold flex items-center gap-1.5"><Clock size={12} /> {booking.slot}</div>
                      </td>
                      <td className="py-4.5 px-4 font-extrabold text-white">Rp {booking.total?.toLocaleString('id-ID')}</td>
                      <td className="py-4.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {status === 'Pending' && (
                            <>
                              <button className="p-2 rounded-xl bg-slate-950/40 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors" title="Konfirmasi">
                                <Check size={14} />
                              </button>
                              <button className="p-2 rounded-xl bg-slate-950/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors" title="Tolak">
                                <X size={14} />
                              </button>
                            </>
                          )}
                          <button className="p-2 rounded-xl bg-slate-950/40 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors" title="Lihat Detail">
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
