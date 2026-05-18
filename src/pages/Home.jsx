import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section flex items-center">
        <div className="container grid grid-cols-2 gap-8 items-center hero-grid">
          <div className="hero-content animate-fade-in">
            <div className="badge mb-6">
              <span className="pulse-dot"></span>
              Sistem Booking Futsal No.1 di Yogyakarta
            </div>
            <h1 className="text-4xl mb-4 font-bold">
              Main Futsal Makin <span className="text-gradient">Gampang</span> & <span className="text-gradient">Cepat</span>
            </h1>
            <p className="text-muted text-lg mb-8">
              Cari jadwal kosong, booking lapangan, dan bayar online tanpa ribet. Solusi terbaik untuk mahasiswa dan warga Yogyakarta yang hobi futsal.
            </p>
            <div className="hero-actions flex gap-4">
              <Link to="/search" className="btn btn-primary">
                Cari Lapangan <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Daftar Sekarang
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper animate-fade-in delay-200">
            <div className="hero-glow"></div>
            <div className="glass-panel image-card">
              <img src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Futsal Court" className="hero-img" />
              <div className="floating-card glass-panel flex items-center gap-4">
                <div className="icon-wrapper bg-success">
                  <CheckCircle size={24} color="#fff" />
                </div>
                <div>
                  <div className="font-bold text-sm">Booking Berhasil</div>
                  <div className="text-xs text-muted">Lapangan A - 19:00 WIB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20 bg-surface">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Kenapa Memilih JogjaFutsal?</h2>
            <p className="text-muted max-w-2xl mx-auto">Kami mengatasi semua masalah penyewaan lapangan futsal konvensional dengan platform digital yang terintegrasi.</p>
          </div>
          <div className="grid grid-cols-3 gap-6 features-grid">
            <FeatureCard 
              icon={<Clock size={32} />}
              title="Real-Time Jadwal"
              desc="Lihat ketersediaan lapangan secara langsung. Tidak perlu lagi chat satu-satu atau datang ke lokasi hanya untuk cek jadwal."
              delay="delay-100"
            />
            <FeatureCard 
              icon={<Zap size={32} />}
              title="Booking Cepat & Anti Double"
              desc="Sistem pencatatan otomatis yang mencegah double booking. Pesan kapan saja, di mana saja."
              delay="delay-200"
            />
            <FeatureCard 
              icon={<MapPin size={32} />}
              title="Transparansi Informasi"
              desc="Info detail mengenai harga sewa, fasilitas lengkap, dan kualitas lapangan. Tidak ada biaya tersembunyi."
              delay="delay-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div className={`glass-panel feature-card animate-fade-in ${delay}`}>
      <div className="feature-icon mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted text-sm">{desc}</p>
    </div>
  );
}
