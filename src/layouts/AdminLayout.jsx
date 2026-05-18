import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarDays, MapPin, Users, FileText, Settings, 
  LogOut, Bell, MessageSquare, Search, Menu, Activity, ChevronDown 
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    const parsed = storedUser ? JSON.parse(storedUser) : null;
    setAuthUser(parsed);
    if (!parsed || parsed.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);
  
  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/bookings', icon: <CalendarDays size={20} />, label: 'Booking' },
    { path: '/admin/fields', icon: <MapPin size={20} />, label: 'Lapangan' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Pengguna' },
    { path: '/admin/reports', icon: <FileText size={20} />, label: 'Laporan' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Pengaturan' },
  ];

  return (
    <div className="min-h-screen flex text-slate-200 font-sans bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_24%),#081120] relative overflow-hidden">
      {/* Decorative gradient glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[580px] h-[580px] bg-sky-500/10 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[580px] h-[580px] bg-emerald-500/6 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Floating Glassmorphism Sidebar */}
      <aside className={`relative my-4 ml-4 rounded-2xl flex flex-col transition-all duration-300 ease-in-out border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl z-20 shadow-2xl ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
        
        {/* Logo Section */}
        <div className="h-[80px] flex items-center justify-between px-6 border-b border-slate-800/50">
          <div className={`flex items-center gap-3 overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Activity className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-wider text-white">Jogja<span className="text-cyan-400">Futsal</span></span>
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-400 hover:text-white transition-colors focus:outline-none">
            <Menu size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-400/10 text-cyan-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                title={isCollapsed ? item.label : ""}
              >
                {isActive && (
                  <span className="absolute left-[-2px] top-1/4 bottom-1/4 w-[4px] rounded-r bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                )}
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('authUser');
              window.location.href = '/';
            }}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            {!isCollapsed && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative px-4 py-4 md:px-6 md:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_18%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_22%)]" />

        {/* Sticky Glassmorphic Top Navbar */}
        <header className="relative h-[88px] border-b border-slate-800/50 bg-[#081120]/45 backdrop-blur-xl flex justify-between items-center px-4 md:px-8 z-10 shrink-0 sticky top-0">
          
          {/* Search Bar */}
          <div className="relative group w-64 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Cari pemesanan, pengguna..." 
              className="w-full bg-slate-900/50 border border-slate-800/80 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button className="relative p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/50 text-slate-400 hover:text-white transition-all">
              <MessageSquare size={18} />
            </button>
            <button className="relative p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/50 text-slate-400 hover:text-white transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
            </button>
            
            <div className="h-6 w-px bg-slate-800"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-lg">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-[#081120]">
                    <img src="https://ui-avatars.com/api/?name=Admin+Jogja&background=2563eb&color=fff" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#081120] shadow-[0_0_10px_#10b981]"></span>
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-none">Admin Jogja</div>
                <div className="text-[11px] text-slate-400 mt-1">Superadmin</div>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
