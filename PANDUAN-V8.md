# Portofolio V8 — Revisi layout & tipografi

## Yang berubah

- Proyek disusun dalam baris: visual di kiri, informasi di kanan; menjadi satu kolom pada ponsel.
- Judul lengkap hanya muncul di area informasi, dengan ukuran dan spasi yang lebih nyaman untuk judul panjang. Sampul bawaan memakai identitas kategori dan ilustrasi geometris, bukan screenshot aplikasi.
- Ringkasan kartu dibatasi tiga baris. Deskripsi lengkap, semua tag, tujuan, pendekatan, pembelajaran, dan galeri tetap tersedia melalui Lihat detail.
- Empat tag ditampilkan pada ringkasan; sisanya ditandai +N. Ini hanya tampilan, isi konten tidak dihapus.
- Filter kategori, jumlah hasil, hierarki tombol, dan keterangan proyek pribadi ditata ulang.
- Ukuran teks pendukung, line-height, jarak section, pengalaman, keahlian, dialog, dan footer dirapikan.
- Warna krem/merah, motion, bahasa ID/EN, serta editor dipertahankan. Tidak ada perubahan struktur database atau rules.
- Metadata canonical/sitemap menggunakan https://porto-ichsan.sannur-corp.com/.

## Memasang

1. Cadangkan file hosting dan konten CMS.
2. Unggah **seluruh isi folder website** ke document root domain portofolio. Pertahankan konfigurasi Firebase dan aset kustom Anda jika sudah diubah sendiri; bandingkan sebelum mengganti file konfigurasi.
3. Jangan unggah dokumen panduan atau cadangan JSON ke folder publik.
4. Hard refresh dengan Ctrl+F5. Periksa ID/EN, filter, detail, dan gambar proyek pada ponsel maupun komputer.
5. Data proyek yang sudah disimpan di Firestore tetap dimuat pada domain publik. Tidak perlu mengimpor konten rekomendasi, menekan tombol penggantian naskah, atau menerbitkan ulang isi CMS untuk mendapatkan layout baru.

Pratinjau privat memakai data bawaan; konten CMS online Anda tidak ditimpa. Editor pada pratinjau privat tetap mode lokal. Login/publish Firebase nyata belum diuji memakai akun pemilik.

## Verifikasi

Syntax JavaScript dan tes konten/bahasa lolos. Pemeriksaan browser mencakup judul panjang seperti website publik, layout desktop, lebar ponsel 390/320 px, filter, bahasa, dan buka/tutup detail. Tampilan ponsel 320 px tidak memiliki overflow horizontal.

Panduan terdahulu tetap disertakan sebagai referensi editor dan konfigurasi.
