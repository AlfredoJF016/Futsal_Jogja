import { Plus, Search, MapPin, Edit2, Trash2, CalendarDays, Zap } from 'lucide-react';

export default function AdminFields() {
  const fields = [
    { 
      id: 'FLD-A', 
      name: 'Lapangan A (Sintetis)', 
      type: 'Sintetis', 
      price: 150000, 
      status: 'Tersedia', 
      bookings: 142,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80' 
    },
    { 
      id: 'FLD-B', 
      name: 'Lapangan B (Vinyl)', 
      type: 'Vinyl', 
      price: 240000, 
      status: 'Tersedia', 
      bookings: 98,
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=500&q=80' 
    },
    { 
      id: 'FLD-C', 
      name: 'Lapangan C (Semen)', 
      type: 'Semen', 
      price: 100000, 
      status: 'Pemeliharaan', 
      bookings: 35,
      image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=500&q=80' 
    },
  ];

  return (
    <div className="animate-fade-in p-2 text-slate-200">
      
      {/* Header section */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Lapangan</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola data lapangan futsal, tipe permukaan, dan tarif harga.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari lapangan..." 
              className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200" 
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all shrink-0">
            <Plus size={16} /> Tambah Lapangan
          </button>
        </div>
      </div>

      {/* Grid of Fields Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div key={field.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl group hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
            
            {/* Field Image with Gradient Overlay & Status badges */}
            <div className="h-52 overflow-hidden relative">
              <img src={field.image} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
              
              {/* Badges */}
              <div className="absolute top-4 right-4">
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg backdrop-blur-md border 
                  ${field.status === 'Tersedia' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10'}`}>
                  {field.status}
                </span>
              </div>
              <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800/80">
                {field.type}
              </div>
            </div>

            {/* Field Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{field.name}</h2>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-4">
                  <MapPin size={14} className="text-cyan-400" /> JogjaFutsal Arena
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950/20 border border-slate-800/60 rounded-xl p-3.5 mb-6">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Harga Sewa</div>
                    <div className="text-base font-extrabold text-cyan-400 mt-0.5">
                      Rp {field.price.toLocaleString('id-ID')}<span className="text-[11px] text-slate-400 font-normal">/jam</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Booking</div>
                    <div className="text-base font-extrabold text-white mt-0.5 flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-slate-400" /> {field.bookings}x
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-800/60">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-800/80 rounded-xl text-sm font-semibold transition-colors">
                  <Edit2 size={14} /> Edit Detail
                </button>
                <button className="flex items-center justify-center p-2.5 bg-slate-900/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800/80 rounded-xl transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
