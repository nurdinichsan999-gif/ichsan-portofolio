import { firebaseConfig, OWNER_UID, storageEnabled } from './firebase-config.js';
export { OWNER_UID, storageEnabled };

export const CMS_BUILD = 'portfolio-studio-v9-20261026';

/* Firestore rules only allow these five top-level keys inside `content`
   (profile, contact, experience, projects, skills). New fields must live
   INSIDE those maps, never beside them, or publishing will be rejected. */
export const defaultContent = {
  profile: {
    name: 'Muhammad Ichsan Nurdin',
    shortName: 'Ichsan Nurdin',
    headline: 'Operations analyst. Problem solver. Web enthusiast.',
    bio: 'Saya menghubungkan pengalaman operasional e-commerce dengan otomasi dan pengembangan web untuk membuat pekerjaan lebih terstruktur, efisien, dan mudah dijalankan.',
    about: 'Saya lulusan Teknik Elektro Universitas Muhammadiyah Surakarta (2023). Dari bidang itu saya membawa kebiasaan mencari akar masalah dan memeriksa detail sebelum menyimpulkan.\n\nPengalaman operasional e-commerce saya dimulai pada 2023: lebih dulu sebagai QC Content Agent untuk Shopee Video dan Shopee Live, lalu sebagai Senior Analyst yang memimpin tim Seller KYC. Pekerjaan saya berpusat pada SLA, produktivitas, kualitas, penjadwalan roster, dan laporan harian sampai bulanan untuk manajemen.\n\nSaya juga belajar web development dengan membangun proyek sendiri: katalog, aplikasi keuangan, dan platform cerita. Melalui proyek pribadi, saya berlatih menerjemahkan kebutuhan menjadi antarmuka yang jelas dan alur yang dapat digunakan. Saya terbuka untuk peran operasional, otomasi, dan web development tingkat junior, dengan kemauan belajar dan kebiasaan kerja yang terstruktur.',
    degree: 'Sarjana Teknik Elektro',
    university: 'Universitas Muhammadiyah Surakarta',
    educationPeriod: '2018 – 2023',
    currentRole: '',
    currentCompany: '',
    focusTitle: '',
    focusDescription: '',
    greeting: 'Halo, saya Ichsan',
    heroWord: 'PORTFOLIO',
    stats: '3+ | Tahun operasional e-commerce\n4 | Proyek web mandiri\n5+ | Tahun desain grafis freelance',
    status: 'Terbuka untuk peluang baru',
    statusDetail: 'Terbuka untuk peran operasional, otomasi, dan pengembangan web tingkat junior.',
    location: 'Karanganyar, Jawa Tengah',
    languages: 'English — Intermediate\nIndonesia — Fluent',
    photoUrl: '',
    photoAlt: 'Foto Muhammad Ichsan Nurdin mengenakan kemeja flanel merah dan kaos hitam'
  },
  contact: {
    email: 'nurdinichsan999@gmail.com',
    whatsapp: '6282324048036',
    linkedin: 'https://www.linkedin.com/in/muhammad-ichsan-nurdin-1aa048220/',
    cvUrl: 'assets/cv/Muhammad-Ichsan-Nurdin-CV.pdf',
    portfolioUrl: '#proyek'
  },
  experience: [
    {
      role: 'Senior Analyst, Operations',
      company: 'PT Shopee International Indonesia',
      detail: 'Seller KYC Team Lead',
      start: '2025-04',
      end: '2026-10',
      bullets: [
        'Memimpin kinerja tim agar konsisten memenuhi SLA, metrik produktivitas, dan standar kualitas.',
        'Menyusun dan mempresentasikan laporan analitis harian, mingguan, dan bulanan untuk mendukung keputusan manajemen.',
        'Mengoptimalkan roster dan alokasi sumber daya harian agar kapasitas operasional tetap optimal.',
        'Menangani eskalasi pelanggan dan internal, menyelesaikan keluhan yang kompleks secara cepat dan sistematis.',
        'Berkolaborasi lintas fungsi untuk merampingkan proses dan menjaga kepatuhan pada standar perusahaan.',
        'Mengotomatiskan alur kerja harian dengan skrip dan ekstensi berbantuan AI (Google Apps Script) untuk meningkatkan efisiensi.'
      ]
    },
    {
      role: 'QC Content Agent',
      company: 'PT Vads Indonesia',
      detail: 'Shopee Video & Shopee Live',
      start: '2023-03',
      end: '2025-04',
      bullets: [
        'Memoderasi dan mengevaluasi video serta konten livestreaming e-commerce di platform Shopee.',
        'Memastikan konten mematuhi pedoman komunitas, kebijakan, dan standar kualitas platform.',
        'Mengidentifikasi dan mengeskalasi konten yang melanggar kebijakan secara tepat waktu.'
      ]
    },
    {
      role: '2D Graphic Design Editor',
      company: 'Freelance',
      detail: '',
      start: '2017-09',
      end: '2023-01',
      bullets: [
        'Merancang aset grafis sesuai kebutuhan klien: logo, poster, dan materi pemasaran.',
        'Bekerja langsung dengan klien untuk mengubah brief kreatif menjadi solusi visual.'
      ]
    },
    {
      role: 'Electrical Technician Intern',
      company: 'PT Dua Kelinci',
      detail: '',
      start: '2021-10',
      end: '2021-11',
      bullets: [
        'Melakukan inspeksi, perawatan, dan pemecahan masalah pada sistem kelistrikan dan mesin pabrik.',
        'Menjaga sistem tetap berfungsi optimal sesuai standar keselamatan kerja (K3/HSE).',
        'Membaca diagram kelistrikan PLC untuk instalasi dan perbaikan yang presisi.',
        'Mendokumentasikan kegiatan teknis dalam laporan operasional dan perawatan harian.'
      ]
    }
  ],
  projects: [
    {
      id: 'sannur-tools',
      goal: "Menyatukan pengelolaan katalog dan penyajian produk dalam alur yang lebih teratur.",
      approach: "Menyusun alur pengelolaan produk dan kategori melalui workspace admin, lalu menyajikan koleksinya pada halaman publik.",
      features: ["Pengelolaan produk dan kategori", "Ringkasan analytics", "Persiapan sinkronisasi Google Sheets", "Showcase produk publik"],
      learning: "Melatih pemisahan kebutuhan pengelola dan pengunjung, serta penyusunan alur data katalog.",
      title: 'Sannur Tools',
      role: 'Proyek mandiri',
      description: 'Workspace untuk mengelola produk dan kategori, melihat analytics, menyiapkan sinkronisasi Google Sheets, dan menampilkan koleksi produk di halaman showcase publik.',
      url: 'https://sannurtools.sannur-corp.com/',
      category: 'Web Development',
      tags: ['Aplikasi web', 'Dashboard admin', 'Google Sheets'],
      images: []
    },
    {
      id: 'sayur-topaz',
      goal: "Membuat informasi sayur dan hasil bumi mudah ditelusuri melalui katalog digital.",
      approach: "Mengutamakan hierarki informasi produk, pencarian, dan tampilan yang tetap nyaman di berbagai ukuran layar.",
      features: ["Katalog sayur dan hasil bumi", "Pencarian produk", "Tampilan responsif", "Sesi admin pengelolaan katalog"],
      learning: "Mempelajari penyajian informasi produk dan pengalaman menjelajah katalog yang sederhana.",
      title: 'Sayur Topaz',
      role: 'Proyek mandiri',
      description: 'Etalase katalog sayur dan hasil bumi dengan tampilan yang rapi dan pencarian produk yang mudah, dilengkapi sesi admin untuk pengelolaan.',
      url: 'https://sayur-topaz.vercel.app/',
      category: 'Web Development',
      tags: ['E-katalog', 'Storefront', 'Responsif'],
      images: []
    },
    {
      id: 'story-of-sannur',
      goal: "Menyajikan cerita dan bab dalam pengalaman baca yang terstruktur.",
      approach: "Memisahkan alur pembaca dari alur penerbitan agar cerita mudah ditemukan dan dikelola.",
      features: ["Pustaka cerita", "Halaman pembacaan bab", "Informasi cerita", "Panel admin penerbitan"],
      learning: "Melatih penataan konten, navigasi antarhalaman, dan keterbacaan pada layar kecil.",
      title: 'Story of Sannur',
      role: 'Proyek mandiri',
      description: 'Platform baca web novel: pustaka cerita, halaman bab, halaman informasi, dan panel admin untuk menerbitkan cerita.',
      url: 'https://sannurstory.sannur-corp.com/',
      category: 'Web Development',
      tags: ['Platform baca', 'Panel admin', 'Responsif'],
      images: []
    },
    {
      id: 'dompet-sannur',
      goal: "Membantu pencatatan keuangan pribadi melalui informasi yang lebih tertata.",
      approach: "Mengelompokkan transaksi, dompet, anggaran, dan target tabungan dalam satu aplikasi pribadi.",
      features: ["Pencatatan transaksi", "Pengelolaan dompet", "Penyusunan anggaran", "Target tabungan"],
      learning: "Mempelajari struktur data transaksi dan perancangan alur input yang mudah dipahami.",
      title: 'DompetSannur',
      role: 'Proyek mandiri',
      description: 'Aplikasi catatan keuangan pribadi untuk mencatat transaksi, mengelola dompet, menyusun anggaran, dan mengejar target tabungan.',
      url: 'https://sannurfinnance.sannur-corp.com/',
      category: 'Web Development',
      tags: ['Aplikasi web', 'Keuangan pribadi', 'Anggaran'],
      images: []
    }
  ],
  skills: [
    {
      title: 'Operasional dan kepemimpinan',
      description: 'Menjaga kinerja tim, kualitas, dan keputusan berbasis data.',
      tags: ['SLA Management', 'Quality Control', 'Data Analysis', 'Pelaporan harian, mingguan, bulanan', 'Roster dan alokasi sumber daya', 'Penanganan eskalasi', 'Team Leadership & Communication', 'Time Management', 'Adaptability']
    },
    {
      title: 'Web, otomasi, dan AI',
      description: 'Membangun antarmuka dan alur kerja yang mengurangi pekerjaan berulang.',
      tags: ['HTML, CSS, JavaScript', 'Motion (animasi web)', 'Firebase (Firestore dan Authentication)', 'Google Sheets & Apps Script', 'AI-Assisted Scripting & Workflow Automation']
    },
    {
      title: 'Teknik dan desain',
      description: 'Latar Teknik Elektro dan pengalaman visual.',
      tags: ['PLC Programming', 'Arduino IDE', 'Diagram kelistrikan PLC', 'K3/HSE', 'CorelDRAW', 'Photography', 'Microsoft Office']
    }
  ]
};

export const copy = value => JSON.parse(JSON.stringify(value));

export const CATEGORY_PRESETS = ['Web Development', 'AI & Automation', 'Photography', '2D Design', 'Graphic Design'];
export function normalizeCategory(value) {
  const label = String(value ?? '').trim().replace(/\s+/g, ' ');
  const known = new Map([
    ['web', 'Web Development'], ['web development', 'Web Development'],
    ['automation', 'AI & Automation'], ['ai & automation', 'AI & Automation'],
    ['photography', 'Photography'], ['2d design', '2D Design'], ['graphic design', 'Graphic Design']
  ]);
  return known.get(label.toLowerCase()) || label;
}

/* Content saved by the previous (V3) site has no `profile.status` key. The new
   admin always writes that key (even when empty), so its absence reliably
   identifies old content. */
export function isLegacyContent(content) {
  return !content || typeof content !== 'object' || !content.profile || typeof content.profile.status !== 'string';
}

/* An image entry is "URL" or "URL | caption" (space, pipe, space). */
export function parseImageEntry(entry) {
  const raw = String(entry ?? '');
  const at = raw.indexOf(' | ');
  return {
    url: (at < 0 ? raw : raw.slice(0, at)).trim(),
    caption: (at < 0 ? '' : raw.slice(at + 3)).trim()
  };
}

const ANCHORS = ['#beranda', '#tentang', '#pengalaman', '#proyek', '#keahlian', '#kontak'];
const SITE_PATH = /^\/?assets\/[A-Za-z0-9][A-Za-z0-9._\/-]*$/;

/* Returns a safe URL string or ''. Accepts HTTPS URLs without credentials, plus
   (when allowed) page anchors and files under this site's own /assets/ folder. */
export function safeUrl(value, allowAnchor = false, allowPath = false) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (allowAnchor && ANCHORS.includes(text)) return text;
  if (allowPath && SITE_PATH.test(text) && !text.includes('..') && !text.includes('//')) return text.replace(/^\//, '');
  try {
    const url = new URL(text);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

export function normalizeContent(value) {
  const c = copy(value);
  if (c && typeof c === 'object') {
    if (c.profile && typeof c.profile === 'object') {
      ['greeting', 'heroWord', 'stats'].forEach(key => { if (c.profile[key] === undefined) c.profile[key] = defaultContent.profile[key]; });
      ['educationPeriod', 'status', 'statusDetail', 'location', 'languages', 'currentRole', 'currentCompany', 'focusTitle', 'focusDescription', 'degree', 'university', 'about', 'photoUrl', 'photoAlt']
        .forEach(key => { if (c.profile[key] === undefined) c.profile[key] = ''; });
    }
    if (c.contact && typeof c.contact === 'object') {
      ['whatsapp', 'cvUrl', 'linkedin', 'portfolioUrl', 'email'].forEach(key => { if (c.contact[key] === undefined) c.contact[key] = ''; });
    }
    if (Array.isArray(c.projects)) {
      c.projects = c.projects.map((p, index) => {
        if (!p || typeof p !== 'object' || Array.isArray(p)) return p;
        return {
          ...p,
          id: p.id === undefined ? 'legacy-project-' + (index + 1) : p.id,
          role: p.role === undefined ? '' : p.role,
          goal: p.goal ?? (defaultContent.projects.find(d => d.id === p.id && d.title === p.title)?.goal || ''),
          approach: p.approach ?? (defaultContent.projects.find(d => d.id === p.id && d.title === p.title)?.approach || ''),
          learning: p.learning ?? (defaultContent.projects.find(d => d.id === p.id && d.title === p.title)?.learning || ''),
          features: p.features ?? (defaultContent.projects.find(d => d.id === p.id && d.title === p.title)?.features || []),
          category: typeof p.category === 'string' ? normalizeCategory(p.category) : p.category,
          images: p.images === undefined ? [] : p.images
        };
      });
    }
  }
  return c;
}

export function configured() {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId && !!firebaseConfig.appId
    && ![firebaseConfig.apiKey, firebaseConfig.projectId, firebaseConfig.appId, OWNER_UID].some(v => !v || v.includes('GANTI_'));
}

function needString(value, label, max, required = false) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(label + ' tidak valid atau terlalu panjang.');
}

export function validateContent(input) {
  const c = normalizeContent(input);
  if (!c || typeof c !== 'object' || !c.profile || !c.contact) throw new Error('Format konten tidak valid.');
  const p = c.profile;
  const limits = {
    name: 100, shortName: 60, headline: 300, bio: 2500, about: 10000, degree: 150, university: 200, educationPeriod: 60,
    currentRole: 150, currentCompany: 150, focusTitle: 200, focusDescription: 1000,
    greeting: 40, heroWord: 14, stats: 600, status: 120, statusDetail: 300, location: 120, languages: 500, photoUrl: 2048, photoAlt: 200
  };
  Object.entries(limits).forEach(([key, max]) => needString(p[key], key, max, ['name', 'shortName', 'headline', 'bio'].includes(key)));
  if (p.photoUrl && !safeUrl(p.photoUrl, false, true)) throw new Error('Foto harus berupa URL HTTPS atau file di folder assets/.');

  const k = c.contact;
  needString(k.email, 'Email', 254);
  if (k.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(k.email)) throw new Error('Format email tidak valid.');
  needString(k.whatsapp, 'Nomor WhatsApp', 20);
  if (k.whatsapp && !/^\d{8,15}$/.test(k.whatsapp)) throw new Error('Nomor WhatsApp berisi 8–15 digit tanpa spasi, tanda plus, atau tanda hubung (contoh: 6281234567890).');
  needString(k.linkedin, 'LinkedIn', 2048);
  if (k.linkedin) {
    const url = safeUrl(k.linkedin);
    if (!url || !/^https:\/\/([a-z0-9-]+\.)?linkedin\.com\/in\//i.test(url)) throw new Error('Masukkan URL profil LinkedIn HTTPS yang valid.');
  }
  needString(k.cvUrl, 'Tautan CV', 2048);
  if (k.cvUrl && !safeUrl(k.cvUrl, false, true)) throw new Error('Tautan CV harus URL HTTPS atau file di folder assets/.');
  needString(k.portfolioUrl, 'URL portofolio', 2048);
  if (k.portfolioUrl && !safeUrl(k.portfolioUrl, true)) throw new Error('URL portofolio harus berupa HTTPS atau anchor halaman.');

  if (!Array.isArray(c.experience) || c.experience.length > 30) throw new Error('Maksimal 30 pengalaman kerja.');
  c.experience.forEach((x, i) => {
    ['role', 'company'].forEach(key => needString(x[key], 'Pengalaman ' + (i + 1) + ' ' + key, 200, true));
    needString(x.detail, 'Detail jabatan', 200); needString(x.start, 'Tanggal mulai', 7, true); needString(x.end, 'Tanggal selesai', 7);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(x.start) || (x.end && !/^\d{4}-(0[1-9]|1[0-2])$/.test(x.end))) throw new Error('Format periode harus YYYY-MM.');
    if (x.end && x.end < x.start) throw new Error('Tanggal selesai tidak boleh sebelum tanggal mulai.');
    if (!Array.isArray(x.bullets) || x.bullets.length > 15) throw new Error('Maksimal 15 deskripsi per pengalaman.');
    x.bullets.forEach(b => needString(b, 'Deskripsi pengalaman', 1200, true));
  });

  if (!Array.isArray(c.projects) || c.projects.length > 50) throw new Error('Daftar proyek harus berupa array dengan maksimal 50 proyek.');
  const ids = new Set();
  c.projects.forEach((x, index) => {
    const label = 'Proyek ' + (index + 1);
    if (!x || typeof x !== 'object' || Array.isArray(x)) throw new Error(label + ' tidak valid.');
    needString(x.id, label + ' ID', 80, true);
    if (!/^[a-zA-Z0-9_-]+$/.test(x.id) || ids.has(x.id)) throw new Error(label + ' memiliki ID tidak valid atau duplikat.');
    ids.add(x.id);
    needString(x.title, label + ' judul', 200, true);
    needString(x.role, label + ' peran', 150);
    needString(x.description, label + ' deskripsi', 3000);
    ['goal','approach','learning'].forEach(key => needString(x[key], label + ' ' + key, 3000));
    if (!Array.isArray(x.features) || x.features.length > 15) throw new Error(label + ': maksimal 15 fitur.');
    x.features.forEach(v => needString(v, label + ' fitur', 300, true));
    needString(x.url, label + ' tautan', 2048);
    needString(x.category, label + ' kategori', 100, true);
    if (x.url && !safeUrl(x.url, true)) throw new Error(label + ': tautan harus HTTPS atau anchor halaman yang didukung.');
    if (!Array.isArray(x.tags) || x.tags.length > 15) throw new Error(label + ': maksimal 15 tag.');
    x.tags.forEach(t => needString(t, label + ' tag', 100, true));
    if (!Array.isArray(x.images) || x.images.length > 30) throw new Error(label + ': images harus berupa daftar maksimal 30 gambar.');
    x.images = x.images.map((entry, imageIndex) => {
      needString(entry, label + ' gambar ' + (imageIndex + 1), 2400, true);
      const { url, caption } = parseImageEntry(entry);
      const valid = safeUrl(url, false, true);
      if (!valid || valid.length > 2048) throw new Error(label + ' gambar ' + (imageIndex + 1) + ': gunakan URL HTTPS atau file di folder assets/ (maks. 2048 karakter).');
      if (caption.length > 120) throw new Error(label + ' gambar ' + (imageIndex + 1) + ': caption maksimal 120 karakter.');
      return caption ? valid + ' | ' + caption : valid;
    });
  });

  if (!Array.isArray(c.skills) || c.skills.length !== 3) throw new Error('Terdapat tiga kelompok keahlian.');
  c.skills.forEach(x => {
    needString(x.title, 'Kategori keahlian', 150, true); needString(x.description, 'Deskripsi keahlian', 1000);
    if (!Array.isArray(x.tags) || x.tags.length > 30) throw new Error('Maksimal 30 keahlian per kategori.');
    x.tags.forEach(t => needString(t, 'Keahlian', 100, true));
  });
  [c.profile,...c.projects,...c.experience,...c.skills].forEach(record=>Object.entries(record).forEach(([key,value])=>{if(!key.endsWith('En'))return;const base=key.slice(0,-2);if(!(base in record))throw new Error('Field terjemahan tidak dikenal: '+key);if(Array.isArray(record[base])){if(!Array.isArray(value)||value.length>(base==='tags'?30:15))throw new Error('Daftar terjemahan tidak valid.');value.forEach(v=>needString(v,key,1200,true));}else needString(value,key,base==='about'?10000:3000);}));
  if (new TextEncoder().encode(JSON.stringify(c)).length > 150000) throw new Error('Konten melebihi batas 150 KB.');
  return c;
}

/* connect({ auth:false }) loads only App + Firestore (public site).
   connect({ auth:true }) also loads Authentication (admin). */
const pendingByMode = {};
export function connect({ auth = true } = {}) {
  if (!configured()) return Promise.reject(new Error('Isi firebase-config.js dan UID admin terlebih dahulu.'));
  const mode = auth ? 'auth' : 'public';
  if (!pendingByMode[mode]) {
    pendingByMode[mode] = (async () => {
      const base = 'https://www.gstatic.com/firebasejs/11.10.0/';
      const loads = [import(base + 'firebase-app.js'), import(base + 'firebase-firestore.js')];
      if (auth) loads.push(import(base + 'firebase-auth.js'));
      const [appSDK, firestoreSDK, authSDK] = await Promise.all(loads);
      const app = appSDK.initializeApp(firebaseConfig);
      const db = firestoreSDK.getFirestore(app);
      const result = { app, db, fs: firestoreSDK, reference: firestoreSDK.doc(db, 'portfolio', 'main') };
      if (authSDK) { result.auth = authSDK.getAuth(app); result.authSDK = authSDK; }
      return result;
    })().catch(error => { delete pendingByMode[mode]; throw error; });
  }
  return pendingByMode[mode];
}

export async function storageClient(app) {
  if (!storageEnabled || !firebaseConfig.storageBucket) throw new Error('Unggah foto belum diaktifkan. Gunakan URL HTTPS atau file di folder assets/, atau aktifkan Firebase Storage (paket Blaze).');
  const sdk = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js');
  return { sdk, storage: sdk.getStorage(app) };
}
