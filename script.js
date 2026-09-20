/* =====================================================
   PERPUSTAKAAN CENDEKIA - Kelompok 8
   Isi file:
   1. Data buku dan jadwal (mudah diganti)
   2. Menu untuk layar HP
   3. Smooth scroll
   4. Pencarian dan filter buku
   5. Animasi muncul saat scroll
   6. Status buka/tutup dan profil tim
   ===================================================== */
(() => {
  'use strict';

  const gerakDikurangi = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. DATA ---------- */

  // Ganti atau tambah buku di sini. "label" boleh 'Baru', 'Populer', atau null.
  const BUKU = [
    // --- FIKSI ---
    { judul: 'Hujan', penulis: 'Tere Liye', kategori: 'Fiksi', label: 'Populer', tersedia: true, gambar: 'Hujan.png' },
    { judul: 'Cantik Itu Luka', penulis: 'Eka Kurniawan', kategori: 'Fiksi', label: 'Populer', tersedia: true, gambar: 'CANTIK ITU LUKA.png' },
    { judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', kategori: 'Fiksi', label: 'Populer', tersedia: false, gambar: 'Laskar Pelangi.png' },
    { judul: 'Laut Bercerita', penulis: 'Leila S. Chudori', kategori: 'Fiksi', label: 'Populer', tersedia: true, gambar: 'Laut Becerita.png' },
    { judul: 'Seporsi Mie Ayam Sebelum Mati', penulis: 'Brian Khrisna', kategori: 'Fiksi', label: 'Baru', tersedia: true, gambar: 'Seporsi Mie Ayam Sebelum Mati.png' },

    // --- KOMIK ---
    { judul: 'Haikyuu!!', penulis: 'Haruichi Furudate', kategori: 'Komik', label: 'Populer', tersedia: true, gambar: 'Haikyuu.png' },
    { judul: 'Jujutsu Kaisen', penulis: 'Gege Akutami', kategori: 'Komik', label: 'Baru', tersedia: true, gambar: 'Jujutsu Kaisen.png' },
    { judul: 'My Hero Academia', penulis: 'Kohei Horikoshi', kategori: 'Komik', label: 'Baru', tersedia: true, gambar: 'My Hero Academia.png' },
    { judul: 'Naruto', penulis: 'Masashi Kishimoto', kategori: 'Komik', label: 'Populer', tersedia: true, gambar: 'Naruto.png' },
    { judul: 'One Piece', penulis: 'Eiichiro Oda', kategori: 'Komik', label: 'Populer', tersedia: false, gambar: 'One Piece.png' },

    // --- SEJARAH ---
    { judul: 'Sejarah Indonesia Modern', penulis: 'M.C. Ricklefs', kategori: 'Sejarah', label: null, tersedia: true, gambar: 'Sejarah Indonesia Modern.png' },
    { judul: 'Sejarah Indonesia', penulis: 'Tim Penulis', kategori: 'Sejarah', label: null, tersedia: true, gambar: 'Sejarah Indonesia.png' },
    { judul: 'Sejarah Sumatera', penulis: 'William Marsden', kategori: 'Sejarah', label: null, tersedia: true, gambar: 'Sejarah Sumatera.png' },

    // --- DONGENG ---
    { judul: 'Bawang Merah dan Bawang Putih', penulis: 'Anonim', kategori: 'Dongeng', label: 'Baru', tersedia: true, gambar: 'Bawang Merah dan Bawang Putih.png' },
    { judul: 'Malin Kundang', penulis: 'Anonim', kategori: 'Dongeng', label: 'Populer', tersedia: true, gambar: 'Malin Kundang.png' },
    { judul: 'Timun Emas', penulis: 'Anonim', kategori: 'Dongeng', label: 'Baru', tersedia: false, gambar: 'Timun Emas.png' },

    // --- TEKNOLOGI ---
    { judul: 'Teknologi Informasi dan Komunikasi', penulis: 'Tim Penulis', kategori: 'Teknologi', label: 'Baru', tersedia: true, gambar: 'Teknologi Informasi dan Komunikasi.png' },
    { judul: 'Digital Society', penulis: 'Tim Penulis', kategori: 'Teknologi', label: null, tersedia: true, gambar: 'Digital Society.png' }
  ];

  // Jam layanan per hari (0 = Minggu ... 6 = Sabtu), format [jamBuka, menitBuka, jamTutup, menitTutup].
  // Kalau diubah, ubah juga tabel jam layanan di index.html.
  const JADWAL = {
    0: [],
    1: [[8, 0, 16, 0]],
    2: [[8, 0, 16, 0]],
    3: [[8, 0, 16, 0]],
    4: [[8, 0, 16, 0]],
    5: [[8, 0, 11, 30], [13, 0, 16, 0]],
    6: [[9, 0, 13, 0]]
  };
  const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  /* ---------- 2. MENU HP ---------- */

  const tombolMenu = document.querySelector('.menu-tombol');
  const menu = document.getElementById('menu-utama');

  function aturMenu(buka) {
    menu.classList.toggle('terbuka', buka);
    tombolMenu.setAttribute('aria-expanded', String(buka));
    tombolMenu.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
  }

  tombolMenu.addEventListener('click', () => aturMenu(!menu.classList.contains('terbuka')));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('terbuka')) {
      aturMenu(false);
      tombolMenu.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('terbuka') && !e.target.closest('.header')) aturMenu(false);
  });

  window.matchMedia('(min-width: 52.01em)').addEventListener('change', (e) => {
    if (e.matches) aturMenu(false);
  });

  /* ---------- 3. SMOOTH SCROLL ---------- */

  function gulirKe(target) {
    target.scrollIntoView({ behavior: gerakDikurangi ? 'auto' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  // Link kategori (yang punya data-kategori) ditangani di bagian 4
  document.querySelectorAll('a[href^="#"]:not([data-kategori])').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      gulirKe(target);
      try { history.pushState(null, '', id); } catch (err) { /* abaikan */ }
      aturMenu(false);
    });
  });

  /* ---------- 4. PENCARIAN DAN FILTER BUKU ---------- */

  const rak = document.getElementById('rak');
  const infoHasil = document.getElementById('info-hasil');
  const kosong = document.getElementById('kosong');
  const tombolReset = document.getElementById('reset');
  const formCari = document.getElementById('form-cari');
  const inputCari = document.getElementById('kata-kunci');
  const seksiKoleksi = document.getElementById('koleksi');

  // Huruf kecil dan tanpa aksen, supaya "sejarah" cocok dengan "Sejarah"
  const normal = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  function cocok(buku, kata) {
    if (!kata) return true;
    const teks = normal(`${buku.judul} ${buku.penulis} ${buku.kategori}`);
    return kata.split(/\s+/).every((k) => teks.includes(k));
  }

  function buatBuku(buku, urutan, awal) {
    const el = document.createElement('article');
    el.className = 'buku' + (awal ? ' reveal' : '');
    el.style.setProperty('--i', urutan % 4);

    const label = buku.label ? `<span class="tag">${buku.label}</span>` : '';
    const status = buku.tersedia
      ? '<p class="stat ada">Tersedia</p>'
      : '<p class="stat pinjam">Sedang dipinjam</p>';

    // Menampilkan gambar jika ada
    const tampilanSampul = buku.gambar 
      ? `<img class="sampul-gambar" src="${buku.gambar}" alt="Sampul ${buku.judul}">`
      : `<div class="sampul ton-${urutan % 3}"><h3>${buku.judul}</h3></div>`;

    el.innerHTML = `
      <div class="buku-sampul">
        ${tampilanSampul}
      </div>
      <div class="papan"></div>
      <div class="rincian">
        <p class="penulis">${buku.penulis}</p>
        <p class="kat">${buku.kategori}${label}</p>
        ${status}
      </div>`;
    return el;
  }

  function tampilkan(kataMentah, awal = false) {
    const kata = normal(kataMentah);
    const hasil = BUKU.filter((b) => cocok(b, kata));

    rak.replaceChildren(...hasil.map((b, i) => buatBuku(b, i, awal)));

    if (!kata) {
      infoHasil.textContent = `Menampilkan semua ${BUKU.length} buku.`;
    } else if (hasil.length) {
      infoHasil.textContent = `Menampilkan ${hasil.length} dari ${BUKU.length} buku untuk “${kataMentah.trim()}”.`;
    } else {
      infoHasil.textContent = 'Tidak ada hasil.';
    }

    kosong.hidden = hasil.length > 0;
    kosong.textContent = hasil.length
      ? ''
      : `Belum ada buku yang cocok dengan “${kataMentah.trim()}”. Coba judul, nama penulis, atau kategori lain.`;
    tombolReset.hidden = !kata;
  }

  function cariKategori(kategori) {
    inputCari.value = kategori;
    tampilkan(kategori);
    gulirKe(seksiKoleksi);
    aturMenu(false);
  }

  inputCari.addEventListener('input', () => tampilkan(inputCari.value));

  formCari.addEventListener('submit', (e) => {
    e.preventDefault();
    tampilkan(inputCari.value);
    gulirKe(seksiKoleksi);
  });

  tombolReset.addEventListener('click', () => {
    inputCari.value = '';
    tampilkan('');
  });

  document.querySelectorAll('[data-kategori]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      cariKategori(el.dataset.kategori);
    });
  });

  tampilkan('', true);

  /* ---------- 5. ANIMASI MUNCUL SAAT SCROLL ---------- */

  const elemenReveal = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !gerakDikurangi) {
    const pengamat = new IntersectionObserver((daftar) => {
      daftar.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add('tampil');
          pengamat.unobserve(item.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    elemenReveal.forEach((el) => pengamat.observe(el));
  } else {
    elemenReveal.forEach((el) => el.classList.add('tampil'));
  }

  /* ---------- 6. STATUS BUKA DAN PROFIL TIM ---------- */

  // Waktu sekarang di zona WIB, apa pun zona waktu pengunjung
  function waktuSekarang() {
    try {
      const bagian = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      const ambil = (t) => bagian.find((b) => b.type === t).value;
      return {
        hari: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(ambil('weekday')),
        menit: Number(ambil('hour')) * 60 + Number(ambil('minute'))
      };
    } catch (err) {
      const d = new Date();
      return { hari: d.getDay(), menit: d.getHours() * 60 + d.getMinutes() };
    }
  }

  const format = (j, m) => `${String(j).padStart(2, '0')}.${String(m).padStart(2, '0')}`;

  function cekStatus({ hari, menit }) {
    for (const [j1, m1, j2, m2] of JADWAL[hari]) {
      if (menit >= j1 * 60 + m1 && menit < j2 * 60 + m2) {
        return { buka: true, teks: `Buka sekarang, tutup pukul ${format(j2, m2)}` };
      }
    }
    for (let selisih = 0; selisih <= 7; selisih++) {
      const h = (hari + selisih) % 7;
      for (const [j1, m1] of JADWAL[h]) {
        if (selisih > 0 || j1 * 60 + m1 > menit) {
          const kapan = selisih === 0 ? 'hari ini' : selisih === 1 ? 'besok' : NAMA_HARI[h];
          return { buka: false, teks: `Tutup sekarang, buka lagi ${kapan} pukul ${format(j1, m1)}` };
        }
      }
    }
    return { buka: false, teks: 'Tutup sekarang' };
  }

  const sekarang = waktuSekarang();
  const status = cekStatus(sekarang);
  const elStatus = document.getElementById('status-buka');
  elStatus.textContent = status.teks;
  elStatus.classList.toggle('buka', status.buka);

  // Tandai baris hari ini di tabel jam layanan
  document.querySelectorAll('.jadwal tr').forEach((baris) => {
    if (baris.dataset.hari.split(' ').includes(String(sekarang.hari))) {
      baris.classList.add('hari-ini');
      const sel = baris.querySelector('th');
      const penanda = document.createElement('span');
      penanda.className = 'penanda';
      penanda.textContent = 'Hari ini';
      sel.appendChild(penanda);
    }
  });

  // Inisial di lingkaran anggota dibuat dari nama
  document.querySelectorAll('.anggota li').forEach((li) => {
    const nama = li.querySelector('.anggota-nama').textContent.trim();
    li.querySelector('.monogram').textContent = nama
      .split(/\s+/).slice(0, 2).map((k) => k[0]).join('').toUpperCase();
  });

  document.getElementById('tahun').textContent = new Date().getFullYear();
})();
