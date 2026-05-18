import { useState } from 'react';
import { Search, Edit2, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 'USR-001', name: 'John Doe', email: 'john@example.com', joinDate: '12 Jan 2026', totalBookings: 12, activeBookings: 1, status: 'Active', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff' },
    { id: 'USR-002', name: 'Budi Santoso', email: 'budi@santoso.id', joinDate: '24 Feb 2026', totalBookings: 8, activeBookings: 0, status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=10b981&color=fff' },
    { id: 'USR-003', name: 'Citra Kirana', email: 'citra@mail.com', joinDate: '02 Mar 2026', totalBookings: 3, activeBookings: 1, status: 'Pending', avatar: 'https://ui-avatars.com/api/?name=Citra+Kirana&background=f59e0b&color=fff' },
    { id: 'USR-004', name: 'Dimas Anggara', email: 'dimas@anggara.net', joinDate: '18 Apr 2026', totalBookings: 0, activeBookings: 0, status: 'Blocked', avatar: 'https://ui-avatars.com/api/?name=Dimas+Anggara&background=ef4444&color=fff' },
    { id: 'USR-005', name: 'Eka Saputra', email: 'eka.saputra@outlook.com', joinDate: '05 Mei 2026', totalBookings: 15, activeBookings: 2, status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Eka+Saputra&background=8b5cf6&color=fff' },
  ]);

  return (
    <div className="animate-fade-in p-2 text-slate-200">
      
      {/* Page Title & Search Header */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola hak akses, status, dan riwayat pesanan member.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari pengguna..." 
              className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/50 text-slate-300 rounded-xl text-sm font-semibold transition-colors">
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
                <th className="py-4 pl-6">Profil Pengguna</th>
                <th className="py-4 px-4">Bergabung</th>
                <th className="py-4 px-4 text-center">Total Booking</th>
                <th className="py-4 px-4 text-center">Booking Aktif</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors group">
                  
                  {/* User Profile */}
                  <td className="py-4.5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border border-slate-800/60 shadow-sm" />
                        <span className={`absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 rounded-full border border-slate-900
                          ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                            user.status === 'Blocked' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{user.name}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Join Date */}
                  <td className="py-4.5 px-4 text-slate-300 font-medium">{user.joinDate}</td>
                  
                  {/* Total Bookings */}
                  <td className="py-4.5 px-4 text-center font-bold text-white">{user.totalBookings}x</td>
                  
                  {/* Active Bookings */}
                  <td className="py-4.5 px-4 text-center">
                    {user.activeBookings > 0 ? (
                      <span className="bg-blue-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-extrabold border border-blue-500/20">
                        {user.activeBookings}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">0</span>
                    )}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="py-4.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                      ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        user.status === 'Blocked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {user.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="py-4.5 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-xl bg-slate-950/40 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors" title="Edit Profil">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 rounded-xl bg-slate-950/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors" title="Blokir/Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Section */}
        <div className="px-6 py-4 bg-slate-950/20 border-t border-slate-800/60 flex justify-between items-center text-xs font-semibold text-slate-400">
          <div>Menampilkan 5 dari 5 pengguna</div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 text-slate-300 disabled:opacity-40 transition-colors" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 text-slate-300 disabled:opacity-40 transition-colors" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
