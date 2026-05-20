import { useState, useEffect } from 'react';
import { Search, Trash2, Ban, Unlock } from 'lucide-react';
import { getStoredUsers, updateUserStatus, deleteUser } from '../../data/users';
import { getAllBookings } from '../../data/venues';
import { logAdminActivity } from '../../utils/activityLogger';

export default function AdminUsers() {
  const [users, setUsers] = useState(getStoredUsers());
  const [searchQuery, setSearchQuery] = useState('');

  const reload = () => {
    setUsers(getStoredUsers());
  };

  const [activeSessions, setActiveSessions] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('active_sessions') || '[]');
    }
    return [];
  });

  useEffect(() => {
    const handleStorage = () => {
      setActiveSessions(JSON.parse(localStorage.getItem('active_sessions') || '[]'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggleBlock = (user) => {
    if (user.status === 'diblokir') {
      if (confirm(`Yakin ingin membuka blokir akun "${user.name}"?`)) {
        const updated = updateUserStatus(user.id, 'Nonaktif');
        setUsers(updated);
        logAdminActivity('unblock_user', `Membuka blokir akun member: "${user.name}" (${user.email})`);
      }
    } else {
      if (confirm(`Yakin ingin memblokir akun "${user.name}"? Pengguna tidak akan bisa melakukan login.`)) {
        const updated = updateUserStatus(user.id, 'diblokir');
        setUsers(updated);
        
        // Remove from active sessions
        const emailLower = user.email.toLowerCase();
        const updatedSessions = activeSessions.filter(email => email !== emailLower);
        localStorage.setItem('active_sessions', JSON.stringify(updatedSessions));
        setActiveSessions(updatedSessions);
        // Force storage event for other windows
        window.dispatchEvent(new Event('storage'));

        logAdminActivity('block_user', `Memblokir akun member: "${user.name}" (${user.email})`);
      }
    }
  };

  const handleDelete = (user) => {
    if (confirm(`Yakin ingin menghapus akun "${user.name}" secara permanen? Semua data profil akan dihapus.`)) {
      const updated = deleteUser(user.id);
      setUsers(updated);

      // Remove from active sessions
      const emailLower = user.email.toLowerCase();
      const updatedSessions = activeSessions.filter(email => email !== emailLower);
      localStorage.setItem('active_sessions', JSON.stringify(updatedSessions));
      setActiveSessions(updatedSessions);
      // Force storage event for other windows
      window.dispatchEvent(new Event('storage'));

      logAdminActivity('delete_user', `Menghapus akun member secara permanen: "${user.name}" (${user.email})`);
    }
  };

  const allBookings = getAllBookings();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in p-2 text-slate-200">
      
      {/* Page Title & Search Header */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola hak akses, status (aktif/Nonaktif real-time), dan pemblokiran akun member.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari pengguna..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200" 
            />
          </div>
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
                <th className="py-4 px-4">Status Akun</th>
                <th className="py-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userBookings = allBookings.filter(b => (b.userEmail || '').trim().toLowerCase() === user.email.toLowerCase());
                  const totalBookings = userBookings.length;
                  const activeBookings = userBookings.filter(b => b.status === 'valid').length;

                  // Determine real-time status:
                  // 1. If status is 'diblokir' in storage, it is 'diblokir'
                  // 2. Otherwise, check if user's email is in activeSessions -> 'aktif'
                  // 3. Otherwise -> 'Nonaktif'
                  const isUserLoggedIn = activeSessions.includes(user.email.toLowerCase());
                  const displayStatus = user.status === 'diblokir' ? 'diblokir' : (isUserLoggedIn ? 'aktif' : 'Nonaktif');

                  return (
                    <tr key={user.id} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors group">
                      
                      {/* User Profile */}
                      <td className="py-4.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border border-slate-800/60 shadow-sm" />
                            <span className={`absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 rounded-full border border-slate-900
                              ${displayStatus === 'aktif' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                                displayStatus === 'diblokir' ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
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
                      <td className="py-4.5 px-4 text-center font-bold text-white">{totalBookings}x</td>
                      
                      {/* Active Bookings */}
                      <td className="py-4.5 px-4 text-center">
                        {activeBookings > 0 ? (
                          <span className="bg-blue-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-extrabold border border-blue-500/20">
                            {activeBookings}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">0</span>
                        )}
                      </td>
                      
                      {/* Realtime Status Badge */}
                      <td className="py-4.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                          ${displayStatus === 'aktif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            displayStatus === 'diblokir' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                          {displayStatus === 'aktif' ? 'Aktif' : displayStatus === 'diblokir' ? 'Diblokir' : 'Nonaktif'}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-4.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.status === 'diblokir' ? (
                            <button 
                              onClick={() => handleToggleBlock(user)}
                              className="p-2 rounded-xl bg-slate-950/40 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors" 
                              title="Buka Blokir Akun"
                            >
                              <Unlock size={14} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleToggleBlock(user)}
                              className="p-2 rounded-xl bg-slate-950/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors" 
                              title="Blokir Akun"
                            >
                              <Ban size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(user)}
                            className="p-2 rounded-xl bg-slate-950/40 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 border border-slate-800 transition-colors" 
                            title="Hapus Akun Permanen"
                          >
                            <Trash2 size={14} />
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
        
        {/* Pagination Section */}
        <div className="px-6 py-4 bg-slate-950/20 border-t border-slate-800/60 flex justify-between items-center text-xs font-semibold text-slate-400">
          <div>Menampilkan {filteredUsers.length} pengguna</div>
        </div>
      </div>

    </div>
  );
}
