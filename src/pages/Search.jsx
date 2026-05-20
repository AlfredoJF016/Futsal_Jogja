import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { VENUES, getVenueSummary, normalizeDate } from '../data/venues';
import './Search.css';

export default function Search() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reload, setReload] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Semua Wilayah Yogyakarta');
  const dateString = normalizeDate(selectedDate);

  const filteredVenues = VENUES.filter((venue) => {
    if (selectedLocation === 'Semua Wilayah Yogyakarta') return true;
    return venue.location.toLowerCase().includes(selectedLocation.toLowerCase());
  });

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'futsal_bookings' || event.key === null) {
        setReload((value) => value + 1);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Generate next 7 days for the date picker
  const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  return (
    <div className="search-page container py-8">
      <div className="search-header text-center mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">Cari Jadwal Lapangan</h1>
        <p className="text-muted max-w-2xl mx-auto">Temukan lapangan futsal terbaik di Yogyakarta sesuai dengan jadwal yang kamu inginkan.</p>
      </div>

      <div className="search-filters glass-panel p-6 mb-8 animate-fade-in delay-100">
        <div className="grid grid-cols-3 gap-6">
          <div className="form-group mb-0">
            <label className="form-label flex items-center gap-2"><MapPin size={16}/> Lokasi</label>
            <select 
              className="form-input"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option>Semua Wilayah Yogyakarta</option>
              <option>Sleman</option>
              <option>Kota Yogyakarta</option>
              <option>Bantul</option>
            </select>
          </div>
          <div className="form-group mb-0">
            <label className="form-label flex items-center gap-2"><Calendar size={16}/> Tanggal</label>
            <input
              type="date"
              className="form-input"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(event) => setSelectedDate(new Date(event.target.value))}
            />
          </div>
          <div className="form-group mb-0 flex items-end">
            <button className="btn btn-primary w-full">
              <SearchIcon size={18} /> Cari Lapangan
            </button>
          </div>
        </div>
      </div>

      {/* Date Picker Ribbon */}
      <div className="date-ribbon flex gap-4 overflow-x-auto pb-4 mb-8 animate-fade-in delay-200">
        {dates.map((date, idx) => {
          const isSelected = normalizeDate(date) === dateString;
          return (
            <button
              key={idx}
              className={`date-card glass-panel ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="date-day">{format(date, 'EEEE', { locale: id })}</span>
              <span className="date-num">{format(date, 'd')}</span>
              <span className="date-month">{format(date, 'MMM')}</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="results-grid grid grid-cols-3 gap-6">
        {filteredVenues.length === 0 ? (
          <div className="col-span-3 text-center py-12 glass-panel">
            <p className="text-slate-400">Tidak ada lapangan yang ditemukan di lokasi terpilih.</p>
          </div>
        ) : (
          filteredVenues.map((venue, idx) => {
            const summary = getVenueSummary(venue, dateString);
          const statusLabel = summary.openSlotCount > 0
            ? `Tersedia di ${summary.firstAvailableCourt?.label}`
            : 'Semua penuh';

          return (
            <div key={venue.id} className="court-card glass-panel animate-fade-in" style={{ animationDelay: `${(idx + 3) * 100}ms` }}>
              <div className="court-image-wrapper">
                <img src={venue.image} alt={venue.name} className="court-img" />
                <div className="court-type-badge">{venue.type}</div>
              </div>
              <div className="court-info p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{venue.name}</h3>
                    <div className="text-xs text-muted mt-1">2 Lapangan per tempat (A & B)</div>
                  </div>
                  <div className="rating flex items-center gap-1 text-warning">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-bold">{venue.rating}</span>
                  </div>
                </div>
                <div className="text-muted text-sm flex items-center gap-1 mb-4">
                  <MapPin size={14} /> {venue.location}
                </div>

                <div className="price-tag mb-4">
                  <span className="text-primary font-bold text-xl">Rp {venue.courts[0].price.toLocaleString('id-ID')}</span>
                  <span className="text-muted text-sm">/jam</span>
                </div>

                <div className="slots-container mb-4">
                  <div className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Clock size={14} /> Slot Kunci:
                  </div>
                  {summary.availableSlots.length > 0 ? (
                    <div className="slots-grid flex flex-wrap gap-2">
                      {summary.availableSlots.slice(0, 3).map((slot) => (
                        <span key={slot} className="slot-badge">{slot}</span>
                      ))}
                      {summary.availableSlots.length > 3 && <span className="slot-badge">+{summary.availableSlots.length - 3} lagi</span>}
                    </div>
                  ) : (
                    <div className="text-rose-300 text-sm">Semua slot penuh</div>
                  )}
                </div>

                <div className="mb-4 text-sm font-semibold text-slate-300">{statusLabel}</div>

                <Link
                  to={`/booking/${venue.id}?date=${dateString}`}
                  className={`btn ${summary.openSlotCount > 0 ? 'btn-outline' : 'btn-secondary'} w-full justify-center`}
                >
                  {summary.openSlotCount > 0 ? 'Pilih Lapangan' : 'Lihat Detail'}
                </Link>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
