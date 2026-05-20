/**
 * Helper to export financial and operational reports to PDF via browser print-to-pdf.
 * It renders a professional, print-styled layout excluding UI chrome like sidebars and search bars.
 */
export function exportToPDF({ title, stats, bookingsData }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk dapat mengunduh laporan PDF.');
    return;
  }

  // Generate rows for bookings
  const bookingRows = bookingsData.map((b, idx) => {
    const totalPay = b.total || 0;
    const formattedTotal = `Rp ${totalPay.toLocaleString('id-ID')}`;
    const statusText = b.status === 'valid' ? 'Valid' : 'Perlu Validasi';
    const statusColorBg = b.status === 'valid' ? '#d1fae5' : '#fee2e2';
    const statusColorText = b.status === 'valid' ? '#065f46' : '#991b1b';

    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${b.date}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">${b.userEmail}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${b.venueName || 'Lapangan'} - ${b.courtLabel || 'Sub Lapangan'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">${b.slot}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #0f172a;">${formattedTotal}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">
          <span style="padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; background-color: ${statusColorBg}; color: ${statusColorText};">
            ${statusText}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  // Generate stats grid
  const statsHTML = stats.map(s => {
    const isNegative = s.percentage && s.percentage.startsWith('-');
    const trendColor = isNegative ? '#ef4444' : '#10b981';

    return `
      <div style="flex: 1; min-width: 160px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px;">${s.label}</div>
        <div style="font-size: 20px; font-weight: 800; color: #0f172a; tracking: -0.5px;">${s.value}</div>
        ${s.percentage ? `<div style="font-size: 11px; color: ${trendColor}; font-weight: bold; margin-top: 6px;">${s.percentage}</div>` : ''}
      </div>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @page {
          size: A4 portrait;
          margin: 20mm;
        }

        body {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
          line-height: 1.5;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
        }

        .header-title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .header-date {
          font-size: 11px;
          color: #64748b;
          margin-top: 6px;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          color: #2563eb;
          text-align: right;
        }

        .brand-subtitle {
          font-size: 10px;
          color: #64748b;
          margin-top: 2px;
          text-align: right;
        }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 12px;
          margin-top: 30px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-left: 3px solid #2563eb;
          padding-left: 8px;
        }

        .stats-grid {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 11px;
        }

        .table th {
          background-color: #f8fafc;
          color: #475569;
          font-weight: 700;
          text-align: left;
          padding: 10px;
          border-bottom: 2px solid #cbd5e1;
        }

        .footer-note {
          margin-top: 40px;
          text-align: center;
          font-size: 10px;
          color: #94a3b8;
          border-t: 1px solid #e2e8f0;
          padding-top: 15px;
        }

        @media print {
          body {
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header-container">
        <div>
          <h1 class="header-title">${title}</h1>
          <div class="header-date">Dicetak pada: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div>
          <div class="brand-name">Jogja<span style="color: #0f172a;">Futsal</span></div>
          <div class="brand-subtitle">Laporan Real-time Administrasi Lapangan</div>
        </div>
      </div>

      <div class="section-title">Ringkasan Analitik Performa</div>
      <div class="stats-grid">
        ${statsHTML}
      </div>

      <div class="section-title">Rincian Riwayat Transaksi & Booking</div>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">No</th>
            <th>Tanggal</th>
            <th>Email Pengguna</th>
            <th>Tempat / Lapangan</th>
            <th style="text-align: center;">Jam Slot</th>
            <th style="text-align: right;">Total Bayar</th>
            <th style="text-align: center;">Status Verifikasi</th>
          </tr>
        </thead>
        <tbody>
          ${bookingRows.length > 0 ? bookingRows : '<tr><td colspan="7" style="text-align:center; padding:20px; color:#94a3b8;">Belum ada riwayat pesanan yang terekam.</td></tr>'}
        </tbody>
      </table>

      <div class="footer-note">
        Laporan ini dibuat otomatis secara elektronik oleh JogjaFutsal. Dokumen ini sah sebagai rekapitulasi data resmi.
      </div>

      <script>
        // Trigger print window automatically when fully loaded
        window.onload = function() {
          setTimeout(function() {
            window.print();
            // Automatically close the popup tab after print dialog resolves
            window.onafterprint = function() {
              window.close();
            };
          }, 350);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
