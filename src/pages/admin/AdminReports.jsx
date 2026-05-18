import { Download, TrendingUp, Calendar as CalendarIcon, Filter } from 'lucide-react';

export default function AdminReports() {
  return (
    <div className="animate-fade-in p-2 text-slate-200">
      
      {/* Header Section */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Laporan & Analitik</h1>
          <p className="text-slate-400 text-sm mt-1">Ringkasan performa finansial dan operasional lapangan.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors">
            <Filter size={16} /> Filter Laporan
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Revenue Chart Simulated */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Tren Pendapatan Harian (Bulan Ini)</h2>
          <div className="h-64 flex items-end gap-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
              <div className="w-full h-px bg-white"></div>
              <div className="w-full h-px bg-white"></div>
              <div className="w-full h-px bg-white"></div>
              <div className="w-full h-px bg-white"></div>
              <div className="w-full h-px bg-white"></div>
            </div>
            {/* Bars */}
            {Array.from({length: 14}).map((_, i) => {
              const height = Math.floor(Math.random() * 70) + 10;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group z-10">
                  <div className="w-full max-w-[30px] bg-blue-600/80 hover:bg-blue-500 rounded-t-md transition-all relative" style={{ height: `${height}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Rp {height}0k</div>
                  </div>
                  <span className="text-[10px] text-slate-500">Tgl {i+1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Mini Cards */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-6 rounded-2xl shadow-xl border border-blue-500/20">
            <div className="text-white/80 text-sm font-semibold mb-2">Total Pendapatan (Bulan Ini)</div>
            <div className="text-3xl font-extrabold text-white mb-2">Rp 12.500.000</div>
            <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">
              <TrendingUp size={14} /> Naik 15% dari bulan lalu
            </div>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl flex-1">
             <div className="text-slate-400 text-sm font-bold mb-4">Statistik Kunci</div>
             <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-slate-300 font-medium">Total Transaksi</span>
                  <span className="font-bold text-white">142</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-slate-300 font-medium">Rata-rata Sewa</span>
                  <span className="font-bold text-white">Rp 88.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Persentase Batal</span>
                  <span className="font-bold text-rose-400">4.2%</span>
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
                <th className="py-4 px-4">Deskripsi</th>
                <th className="py-4 px-4">Metode</th>
                <th className="py-4 pr-6 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { date: '18 Mei 2026', desc: 'Booking Lapangan A - Budi Santoso', method: 'Transfer Bank', amount: 'Rp 150.000', type: 'in' },
                { date: '18 Mei 2026', desc: 'Booking Lapangan B - Andi Pratama', method: 'E-Wallet', amount: 'Rp 240.000', type: 'in' },
                { date: '17 Mei 2026', desc: 'Pengembalian Dana (Refund) - Rizky', method: 'Transfer Bank', amount: '-Rp 200.000', type: 'out' },
                { date: '17 Mei 2026', desc: 'Booking Lapangan C - Citra Kirana', method: 'Tunai', amount: 'Rp 100.000', type: 'in' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 pl-6 text-slate-300 flex items-center gap-2"><CalendarIcon size={14} className="text-slate-500" /> {row.date}</td>
                  <td className="py-4 px-4 text-white font-bold">{row.desc}</td>
                  <td className="py-4 px-4 text-slate-400 font-semibold">{row.method}</td>
                  <td className={`py-4 pr-6 font-extrabold text-right ${row.type === 'in' ? 'text-emerald-400' : 'text-rose-400'}`}>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
