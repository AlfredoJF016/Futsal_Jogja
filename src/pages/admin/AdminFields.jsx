import { useState } from 'react';
import { Plus, Search, MapPin, Edit2, Trash2, CalendarDays, Zap, X, Star } from 'lucide-react';
import { addVenue, updateVenue, deleteVenue, refreshVenues, getStoredVenues, getAllBookings } from '../../data/venues';
import { logAdminActivity } from '../../utils/activityLogger';

const AVAILABLE_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function AdminFields() {
  const [fields, setFields] = useState(getStoredVenues());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('Sleman');
  const [formType, setFormType] = useState('Sintetis');
  const [formRating, setFormRating] = useState(4.5);
  const [formStatus, setFormStatus] = useState('Tersedia');
  const [formImage, setFormImage] = useState('');
  
  // Courts state: we will default to supporting 2 courts per venue (A & B)
  const [courtAPrice, setCourtAPrice] = useState(120000);
  const [courtALabel, setCourtALabel] = useState('Lapangan A');
  const [courtBPrice, setCourtBPrice] = useState(115000);
  const [courtBLabel, setCourtBLabel] = useState('Lapangan B');
  
  // Slots selected
  const [selectedSlots, setSelectedSlots] = useState(['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']);

  const reload = () => {
    setFields(getStoredVenues());
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormName('');
    setFormLocation('Depok, Sleman');
    setFormType('Sintetis');
    setFormRating(4.5);
    setFormStatus('Tersedia');
    setFormImage('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80');
    setCourtALabel('Lapangan A');
    setCourtAPrice(120000);
    setCourtBLabel('Lapangan B');
    setCourtBPrice(115000);
    setSelectedSlots(['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']);
    setIsModalOpen(true);
  };

  const openEditModal = (field) => {
    setModalMode('edit');
    setEditingId(field.id);
    setFormName(field.name);
    setFormLocation(field.location);
    setFormType(field.type);
    setFormRating(field.rating || 4.5);
    setFormStatus(field.status || 'Tersedia');
    setFormImage(field.image);
    
    // Set courts details
    const courtA = field.courts?.[0] || { label: 'Lapangan A', price: 120000 };
    const courtB = field.courts?.[1] || { label: 'Lapangan B', price: 115000 };
    setCourtALabel(courtA.label);
    setCourtAPrice(courtA.price);
    setCourtBLabel(courtB.label);
    setCourtBPrice(courtB.price);

    setSelectedSlots(field.slots || []);
    setIsModalOpen(true);
  };

  const handleToggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot].sort());
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName || !formLocation) {
      alert('Nama tempat dan lokasi wajib diisi!');
      return;
    }

    const venueId = modalMode === 'add' ? `v-${Date.now()}` : editingId;
    const venueData = {
      id: venueId,
      name: formName,
      location: formLocation,
      type: formType,
      rating: Number(formRating) || 4.5,
      image: formImage || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
      courts: [
        { courtId: `${venueId}A`, label: courtALabel || 'Lapangan A', price: Number(courtAPrice) || 120000 },
        { courtId: `${venueId}B`, label: courtBLabel || 'Lapangan B', price: Number(courtBPrice) || 115000 }
      ],
      slots: selectedSlots.length > 0 ? selectedSlots : ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
      status: formStatus
    };

    if (modalMode === 'add') {
      addVenue(venueData);
      logAdminActivity('add_venue', `Menambahkan lapangan futsal baru: "${venueData.name}" di ${venueData.location}`);
    } else {
      updateVenue(venueData);
      logAdminActivity('edit_venue', `Mengubah informasi lapangan futsal: "${venueData.name}"`);
    }

    refreshVenues();
    reload();
    setIsModalOpen(false);
  };

  const handleDelete = (field) => {
    if (confirm(`Hapus tempat futsal "${field.name}" beserta semua lapangannya secara permanen?`)) {
      deleteVenue(field.id);
      refreshVenues();
      reload();
      logAdminActivity('delete_venue', `Menghapus lapangan futsal secara permanen: "${field.name}"`);
    }
  };

  const allBookings = getAllBookings();

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in p-2 text-slate-200">
      
      {/* Header section */}
      <div className="border-b border-slate-800/60 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Lapangan</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola data tempat futsal, tipe permukaan, dan tarif harga secara lengkap.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari lapangan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200" 
            />
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all shrink-0">
            <Plus size={16} /> Tambah Lapangan
          </button>
        </div>
      </div>

      {/* Grid of Fields Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-slate-900/20 rounded-2xl border border-slate-800/50">
            <p className="text-slate-400">Tidak ada tempat futsal yang ditemukan.</p>
          </div>
        ) : (
          filteredFields.map((field) => {
            const bookingsCount = allBookings.filter(b => b.venueId === field.id).length;
            const priceLabel = field.courts?.[0]?.price || 0;

            return (
              <div key={field.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl group hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                
                {/* Field Image with Gradient Overlay & Status badges */}
                <div className="h-52 overflow-hidden relative">
                  <img src={field.image} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg backdrop-blur-md border 
                      ${(field.status || 'Tersedia') === 'Tersedia' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10'}`}>
                      {field.status || 'Tersedia'}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 z-10 bg-slate-950/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800/80 flex items-center gap-1">
                    <Star size={12} className="text-warning fill-warning" />
                    <span>{field.rating || '4.5'}</span>
                  </div>
                </div>

                {/* Field Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">{field.name}</h2>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">{field.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-4">
                      <MapPin size={14} className="text-cyan-400" /> {field.location}
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-950/20 border border-slate-800/60 rounded-xl p-3.5 mb-6">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Harga Sewa</div>
                        <div className="text-sm font-extrabold text-cyan-400 mt-0.5">
                          Rp {priceLabel.toLocaleString('id-ID')}<span className="text-[11px] text-slate-400 font-normal">/jam</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Booking</div>
                        <div className="text-sm font-extrabold text-white mt-0.5 flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-slate-400" /> {bookingsCount}x
                        </div>
                      </div>
                    </div>

                    {/* Operational slots preview */}
                    <div className="mb-4">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Slot Jam Aktif:</div>
                      <div className="flex flex-wrap gap-1">
                        {field.slots?.slice(0, 4).map(slot => (
                          <span key={slot} className="text-[10px] bg-slate-950/30 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            {slot}
                          </span>
                        ))}
                        {field.slots?.length > 4 && (
                          <span className="text-[10px] bg-slate-950/30 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            +{field.slots.length - 4} lagi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-slate-800/60">
                    <button onClick={() => openEditModal(field)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-800/80 rounded-xl text-sm font-semibold transition-colors">
                      <Edit2 size={14} /> Edit Detail
                    </button>
                    <button onClick={() => handleDelete(field)} className="flex items-center justify-center p-2.5 bg-slate-900/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800/80 rounded-xl transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modern Dialog Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800/60 flex justify-between items-center bg-slate-950/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-cyan-400 fill-cyan-400 animate-pulse" size={18} />
                {modalMode === 'add' ? 'Tambah Tempat Futsal Baru' : 'Edit Detail Tempat Futsal'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-slate-950/30 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nama Lapangan / Tempat Futsal</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Champion Futsal Arena"
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200 mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lokasi / Wilayah</label>
                  <input 
                    type="text" 
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Contoh: Depok, Sleman"
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200 mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tipe Lapangan</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200 mt-1.5"
                  >
                    <option value="Sintetis">Sintetis</option>
                    <option value="Vinyl">Vinyl</option>
                    <option value="Semen">Semen</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status Lapangan</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200 mt-1.5"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Pemeliharaan">Pemeliharaan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rating Lapangan (1.0 - 5.0)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1" 
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200 mt-1.5"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">URL Gambar Lapangan</label>
                  <input 
                    type="text" 
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="URL HTTP Gambar Lapangan"
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/40 text-slate-200 mt-1.5"
                  />
                </div>
              </div>

              {/* Sub-Courts Detail Section */}
              <div className="border-t border-slate-800/60 pt-5">
                <h3 className="text-sm font-bold text-white mb-3">Detail Sub-Lapangan & Tarif</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Court A */}
                  <div className="bg-slate-950/20 border border-slate-800/50 rounded-2xl p-4">
                    <h4 className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-3">Lapangan Kesatu (Lapangan A)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Label Sub-Lapangan</label>
                        <input 
                          type="text" 
                          value={courtALabel} 
                          onChange={(e) => setCourtALabel(e.target.value)} 
                          placeholder="Lapangan A"
                          className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Harga per Jam (Rupiah)</label>
                        <input 
                          type="number" 
                          value={courtAPrice} 
                          onChange={(e) => setCourtAPrice(e.target.value)} 
                          className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Court B */}
                  <div className="bg-slate-950/20 border border-slate-800/50 rounded-2xl p-4">
                    <h4 className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-3">Lapangan Kedua (Lapangan B)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Label Sub-Lapangan</label>
                        <input 
                          type="text" 
                          value={courtBLabel} 
                          onChange={(e) => setCourtBLabel(e.target.value)} 
                          placeholder="Lapangan B"
                          className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Harga per Jam (Rupiah)</label>
                        <input 
                          type="number" 
                          value={courtBPrice} 
                          onChange={(e) => setCourtBPrice(e.target.value)} 
                          className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slots Checkbox selection */}
              <div className="border-t border-slate-800/60 pt-5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-3">Jam Operasional / Slot Aktif</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {AVAILABLE_SLOTS.map(slot => {
                    const isChecked = selectedSlots.includes(slot);
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => handleToggleSlot(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 
                          ${isChecked 
                            ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.15)]' 
                            : 'bg-slate-950/20 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-800/60 pt-5 flex justify-end gap-3 bg-slate-950/20 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
