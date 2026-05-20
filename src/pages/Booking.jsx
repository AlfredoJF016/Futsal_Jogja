import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Wallet, Smartphone, CheckCircle, Clock, MapPin, Calendar as CalIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getVenueById, getVenueAvailability, findFirstAvailableCourt, recommendOtherVenues, bookSlot, normalizeDate } from '../data/venues';
import './Booking.css';

export default function Booking() {
  const { courtId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: detail & slot, 2: payment, 3: success
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [assignedCourt, setAssignedCourt] = useState(null);
  const [bookingId, setBookingId] = useState('');

  const rawDate = searchParams.get('date');
  const [bookingDate, setBookingDate] = useState(normalizeDate(rawDate ? new Date(rawDate) : new Date()));

  const venue = useMemo(() => getVenueById(courtId), [courtId]);
  const availability = useMemo(
    () => (venue ? getVenueAvailability(venue, bookingDate) : []),
    [venue, bookingDate]
  );

  useEffect(() => {
    const authUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    setIsAuthenticated(!!authUser);
  }, []);

  const selectedSlotData = useMemo(
    () => availability.find((item) => item.slot === selectedSlot),
    [availability, selectedSlot]
  );

  const fallbackCourt = selectedSlotData?.firstAvailableCourt;

  useEffect(() => {
    setAssignedCourt(null);
  }, [selectedSlot]);

  const handleNext = () => {
    setAuthError('');
    setRecommendations([]);

    if (!isAuthenticated) {
      setAuthError('Anda harus login terlebih dahulu untuk melanjutkan pemesanan lapangan.');
      return;
    }

    if (!selectedSlot) {
      setAuthError('Silakan pilih jadwal lapangan terlebih dahulu.');
      return;
    }

    if (step === 1) {
      if (!fallbackCourt) {
        const recs = recommendOtherVenues(venue.id, bookingDate, selectedSlot);
        setRecommendations(recs);
        setAuthError('Jadwal tersebut penuh di kedua lapangan. Berikut rekomendasi lapangan lain.');
        return;
      }

      setAssignedCourt(fallbackCourt);
      setStep(2);
      return;
    }

    if (step === 2) {
      handleSubmitProof();
    }
  };

  const handleSubmitProof = () => {
    if (!paymentMethod) {
      setAuthError('Silakan pilih metode pembayaran.');
      return;
    }

    const authUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('authUser') ?? '{}') : { email: 'guest' };
    const id = bookSlot(venue, assignedCourt.courtId, bookingDate, selectedSlot, authUser.email || 'guest');
    setBookingId(id);
    
    // Open Whatsapp link
    window.open('https://api.whatsapp.com/qr/VPQBHLTOPXOCN1?autoload=1&app_absent=0', '_blank');
    
    setStep(3);
  };

  const totalPrice = assignedCourt ? assignedCourt.price + 5000 + 10000 : venue?.courts[0].price + 5000 + 10000;

  const renderStepIndicator = () => (
    <div className="step-indicator flex items-center justify-center gap-4 mb-8">
      <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Detail</div>
      <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
      <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Pembayaran</div>
      <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Selesai</div>
    </div>
  );

  if (!venue) {
    return (
      <div className="booking-page container py-10">
        <div className="glass-panel p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Venue tidak ditemukan</h2>
          <p className="text-muted mb-6">Silakan kembali ke halaman pencarian untuk memilih lapangan lain.</p>
          <button className="btn btn-primary" onClick={() => navigate('/search')}>
            Kembali ke Pencarian
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page container py-10">
      {renderStepIndicator()}

      <div className="booking-container mx-auto max-w-4xl">
        {!isAuthenticated && (
          <div className="glass-panel p-8 mb-8 text-center border border-rose-500/20 bg-rose-500/10">
            <h2 className="text-2xl font-bold text-white mb-4">Akses Dibatasi</h2>
            <p className="text-slate-300 mb-6">Anda harus login terlebih dahulu sebelum bisa melakukan pemesanan lapangan.</p>
            <button
              className="btn btn-primary mx-auto"
              onClick={() => {
                const redirect = encodeURIComponent(`/booking/${venue.id}?date=${bookingDate}`);
                navigate(`/login?redirect=${redirect}`);
              }}
            >
              Masuk atau Daftar Sekarang
            </button>
          </div>
        )}

        {step === 1 && isAuthenticated && (
          <div className="grid grid-cols-2 gap-8 booking-grid animate-fade-in">
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4">Informasi Venue</h2>
              <div className="mb-6">
                <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold">{venue.name}</h3>
                <p className="text-muted flex items-center gap-1 mt-2"><MapPin size={16}/> {venue.location}</p>
                <p className="text-sm text-slate-400 mt-2">2 lapangan tersedia: Lapangan A dan Lapangan B.</p>
              </div>

              <h3 className="font-bold mb-3">Pilih Jam Main ({format(new Date(bookingDate), 'dd MMM yyyy')})</h3>
              <div className="space-y-3">
                {availability.map((slotData) => {
                  const availableNames = slotData.availableCourts.map((courtItem) => courtItem.label).join(', ');
                  return (
                    <button
                      key={slotData.slot}
                      className={`slot-btn ${selectedSlot === slotData.slot ? 'selected' : ''} ${!slotData.isAvailable ? 'disabled' : ''}`}
                      disabled={!slotData.isAvailable}
                      onClick={() => setSelectedSlot(slotData.slot)}
                    >
                      <div className="flex justify-between w-full">
                        <span>{slotData.slot}</span>
                        <span className={`text-xs ${slotData.isAvailable ? 'text-emerald-400' : 'text-rose-300'}`}>
                          {slotData.isAvailable ? `Tersedia: ${availableNames}` : 'Penuh semua'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-6">Ringkasan Pesanan</h2>
              <div className="summary-item">
                <span className="text-muted">Tanggal</span>
                <span className="font-semibold">{format(new Date(bookingDate), 'dd MMM yyyy')}</span>
              </div>
              <div className="summary-item">
                <span className="text-muted">Jadwal</span>
                <span className="font-semibold">{selectedSlot ? `${selectedSlot} WIB` : '-'}</span>
              </div>
              <div className="summary-item">
                <span className="text-muted">Lapangan</span>
                <span className="font-semibold">{selectedSlot ? (fallbackCourt?.label || 'Belum dipilih') : '-'}</span>
              </div>
              <div className="summary-item border-b border-[rgba(255,255,255,0.1)] pb-4">
                <span className="text-muted">Harga Sewa (1 Jam)</span>
                <span className="font-semibold">Rp {(fallbackCourt?.price ?? venue.courts[0].price).toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-item">
                <span className="text-muted">Biaya Admin</span>
                <span className="font-semibold">Rp 5.000</span>
              </div>
              <div className="summary-item">
                <span className="text-muted">Pajak (10%)</span>
                <span className="font-semibold">Rp 10.000</span>
              </div>
              <div className="summary-item mt-4 text-xl">
                <span className="font-bold">Total Pembayaran</span>
                <span className="font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>

              {selectedSlot && fallbackCourt && (
                <div className="mt-4 text-sm text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/70">
                  Sistem akan menggunakan <span className="font-semibold">{fallbackCourt.label}</span> secara otomatis jika lapangan A penuh.
                </div>
              )}

              <div className="mt-auto pt-8">
                <button className="btn btn-primary w-full justify-center" onClick={handleNext}>
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}

        {authError && (
          <div className="text-sm text-rose-300 mt-4 text-center">{authError}</div>
        )}

        {recommendations.length > 0 && (
          <div className="glass-panel p-6 mt-6 border border-slate-800/60 bg-slate-950/40">
            <h3 className="text-lg font-bold mb-4">Rekomendasi Lapangan Lain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((venueRec) => (
                <button
                  key={venueRec.id}
                  className="p-4 rounded-2xl border border-slate-800/60 text-left hover:border-cyan-400 hover:bg-slate-900/70 transition-colors"
                  onClick={() => navigate(`/booking/${venueRec.id}?date=${bookingDate}`)}
                >
                  <div className="font-semibold text-white">{venueRec.name}</div>
                  <div className="text-slate-400 text-sm mt-1">{venueRec.location}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && isAuthenticated && (
          <div className="glass-panel p-8 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">Pilih Metode Pembayaran</h2>
            <div className="payment-methods space-y-4 mb-8">
              <label className={`payment-method ${paymentMethod === 'qris' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="qris" onChange={(e) => setPaymentMethod(e.target.value)} hidden />
                <Smartphone className="text-primary" size={24} />
                <div className="flex-1">
                  <div className="font-bold">QRIS</div>
                  <div className="text-sm text-muted">Scan dengan aplikasi e-wallet / m-banking</div>
                </div>
              </label>

              <label className={`payment-method ${paymentMethod === 'ewallet' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="ewallet" onChange={(e) => setPaymentMethod(e.target.value)} hidden />
                <Wallet className="text-primary" size={24} />
                <div className="flex-1">
                  <div className="font-bold">E-Wallet</div>
                  <div className="text-sm text-muted">Gopay, OVO, Dana, ShopeePay</div>
                </div>
              </label>

              <label className={`payment-method ${paymentMethod === 'transfer' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="transfer" onChange={(e) => setPaymentMethod(e.target.value)} hidden />
                <CreditCard className="text-primary" size={24} />
                <div className="flex-1">
                  <div className="font-bold">Transfer Bank</div>
                  <div className="text-sm text-muted">BCA, Mandiri, BNI, BRI</div>
                </div>
              </label>
            </div>

            {paymentMethod && (
              <div className="payment-details-box mt-6 p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 animate-fade-in mb-6">
                {paymentMethod === 'qris' && (
                  <div className="flex flex-col items-center text-center">
                    <p className="text-sm text-slate-300 mb-4 font-medium">Scan kode QRIS di bawah ini untuk membayar:</p>
                    <div className="bg-white p-4 rounded-2xl shadow-xl inline-block mb-4 border border-slate-200">
                      <img src="/FutsalJogja/QRIS.jpeg" alt="QRIS Code" className="w-56 h-auto object-contain mx-auto" />
                    </div>
                    <p className="text-xs text-slate-400">Scan menggunakan GoPay, OVO, Dana, LinkAja, atau aplikasi M-Banking Anda.</p>
                  </div>
                )}

                {paymentMethod === 'ewallet' && (
                  <div>
                    <p className="text-sm text-slate-300 mb-4 font-medium">Silakan lakukan transfer ke salah satu nomor E-Wallet berikut:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">GoPay</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">0812-3456-7890</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">OVO</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">0821-9876-5432</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">DANA</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">0899-8888-7777</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">ShopeePay</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">0857-1111-2222</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div>
                    <p className="text-sm text-slate-300 mb-4 font-medium">Silakan transfer ke salah satu rekening Bank berikut (a/n Futsal Jogja):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">BCA</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">8012345678</span>
                        <span className="text-xs text-slate-500">a/n Futsal Jogja</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">BRI</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">1029384756</span>
                        <span className="text-xs text-slate-500">a/n Futsal Jogja</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">BNI</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">9876543210</span>
                        <span className="text-xs text-slate-500">a/n Futsal Jogja</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <span className="text-xs text-slate-400 font-semibold block uppercase">MANDIRI</span>
                        <span className="font-mono text-base font-bold text-white block mt-1">1324354657</span>
                        <span className="text-xs text-slate-500">a/n Futsal Jogja</span>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleSubmitProof}
                  className="btn btn-primary w-full justify-center text-sm font-bold tracking-wide mt-4"
                >
                  Kirim Bukti
                </button>
              </div>
            )}

            <div className="flex gap-4">
              <button className="btn btn-secondary w-full justify-center" onClick={() => setStep(1)}>
                Kembali
              </button>
            </div>
          </div>
        )}

        {step === 3 && isAuthenticated && (
          <div className="glass-panel p-10 max-w-xl mx-auto text-center animate-fade-in">
            <div className="success-icon mx-auto mb-6">
              <CheckCircle size={64} color="var(--color-success)" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Booking Berhasil!</h2>
            <p className="text-muted mb-4">Booking Anda telah berhasil dicatat.</p>
            <div className="receipt-card glass-panel p-6 mb-8 text-left">
              <div className="flex justify-between mb-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
                <span className="text-muted">ID Booking</span>
                <span className="font-bold">{bookingId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted">Lapangan</span>
                <span className="font-semibold">{assignedCourt?.label}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted">Venue</span>
                <span className="font-semibold">{venue.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted">Tanggal</span>
                <span className="font-semibold">{format(new Date(bookingDate), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Waktu</span>
                <span className="font-semibold">{selectedSlot} WIB</span>
              </div>
            </div>

            <p className="text-sm text-muted mb-8">Silakan tunjukkan ID booking ini kepada petugas saat tiba di lokasi.</p>
            <button className="btn btn-primary w-full justify-center" onClick={() => navigate('/dashboard')}>
              Lihat Dashboard Saya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
