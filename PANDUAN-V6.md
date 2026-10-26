# Pembaruan V7 — Motion & Bilingual

V7 menambahkan pilihan Indonesia / English di navigasi. Pilihan disimpan di browser. Navigasi, heading, profil, pengalaman, keahlian, detail proyek, dan label utama memiliki terjemahan untuk konten bawaan.

Untuk konten kustom yang ditambahkan/diubah melalui CMS, buka **English translation (optional)** di bawah kolom terkait pada editor. Isi versi Inggris, lalu simpan/terbitkan bersama konten Indonesia. Jika dikosongkan, sistem memakai terjemahan bawaan untuk teks yang cocok; teks kustom lainnya tetap ditampilkan dalam bahasa aslinya agar tidak mengarang terjemahan. Mengubah bahasa pada website tidak mengubah data tersimpan.

Terjemahan disimpan sebagai field bersufiks `En` di dalam profile, proyek, pengalaman, dan keahlian. Jika rules aktif Anda membatasi field di map tersebut, tambahkan field terjemahan yang dipakai ke allowlist. Paket ini tidak mengubah rules online.

Motion: nama tampil bertahap dengan reveal, masuknya section mengikuti scroll, garis aksen section, progress baca, parallax foto ringan, ilustrasi bergerak perlahan, tilt/spotlight kartu saat pointer bergerak, respons tombol, serta transisi buka/tutup detail proyek. Efek pointer hanya aktif untuk perangkat dengan pointer presisi; gerakan dekoratif berhenti saat keluar layar/tab tidak aktif. Preferensi reduced motion dihormati.

Pemeriksaan V7: pergantian ID/EN, penyimpanan pilihan bahasa, terjemahan detail proyek, simpan kolom English melalui editor lokal dan tampilkan hasilnya, kembali ke Indonesia tanpa kehilangan data, navigasi pada lebar 390 px, serta tes validasi dan round-trip terjemahan. Login/penerbitan Firebase tetap belum diuji dengan akun pemilik.

Petunjuk pemasangan di bawah tetap berlaku. Unggah seluruh isi folder `website`, termasuk file baru `assets/js/motion.js` dan `assets/js/i18n.js`.

---

# Portofolio Ichsan — V6

Rombakan dari ZIP yang diberikan: visual editorial dengan latar netral dan aksen merah, foto profil transparan baru, hierarki teks yang lebih jelas, grid proyek, detail proyek, filter kategori, galeri, serta editor dengan cadangan JSON. Semua proyek diberi penjelasan bahwa ini karya pribadi dan tidak berafiliasi dengan pihak lain.

## Memasang pada domain Anda

1. Cadangkan file website lama dan unduh cadangan konten melalui admin lama bila tersedia.
2. Buka folder `website` di dalam ZIP ini. Unggah **seluruh isinya**, termasuk `.htaccess`, ke document root domain `ichsan-portofolio.sannur-corp.com`. Jangan unggah folder `docs` atau JSON cadangan ke folder publik.
3. File `index.html`, `admin.html`, `admin.js`, `cms.js`, `firebase-config.js`, dan folder `assets` harus berada dalam susunan yang sama. Website ini statis; tidak memerlukan npm, Node, atau proses build di hosting.
4. Buka website melalui HTTPS dan lakukan hard refresh (Ctrl+F5). Pastikan CV tetap dapat diunduh dan tautan proyek mengarah ke tujuan yang sesuai.
5. Buka `/admin.html`, masuk memakai akun Firebase admin yang sudah ada. Konfigurasi proyek dan UID pemilik dipertahankan dari ZIP; tidak ada kata sandi di source.
6. Konten Firestore yang sudah diterbitkan akan tetap dimuat. Karena konten website online lebih baru daripada ZIP, **jangan menggantinya dengan seluruh JSON rekomendasi tanpa pemeriksaan**.
7. Untuk menerapkan tulisan dan foto baru tanpa mengganti daftar pengalaman, proyek, kontak, dan keahlian: unduh cadangan JSON, lalu klik **Terapkan naskah & foto V6**. Tombol ini mengubah draft profil, menandai proyek sebagai pribadi, dan melengkapi detail kosong untuk proyek yang cocok. Periksa setiap isinya, kemudian klik **Terbitkan perubahan**. Foto bawaan baru digunakan setelah kolom URL foto dikosongkan.
8. Buka ulang website untuk memeriksa hasil. Perubahan database tidak dilakukan oleh paket ZIP atau pratinjau ini secara otomatis.

## Mencoba editor tanpa mengubah website publik

Buka `admin.html?preview=1` melalui server/hosting, bukan dengan klik ganda file. Editor ini menyimpan draft di penyimpanan lokal browser saja. Tombol **Lihat website** menuju `index.html?preview=1`. Draft dapat diunduh sebagai JSON lalu diimpor ke editor admin sesungguhnya setelah diperiksa. Perpindahan antar domain/browser tidak membawa draft lokal.

Pada pratinjau di domain ChatGPT Sites dan `terminal.local`, editor selalu menggunakan mode lokal. Halaman portofolio biasa di pratinjau menampilkan konten bawaan ZIP; gunakan tautan Lihat website di editor untuk melihat draft lokal. Mode ini tidak membaca maupun menulis Firestore. Pada domain website Anda, admin normal tetap memakai Authentication dan Firestore.

## Proyek dan detailnya

- Setiap proyek memiliki ringkasan, tujuan, pendekatan, fitur (satu per baris), pembelajaran, kategori, tag, tautan, serta galeri gambar.
- Tombol **Lihat detail** dan sampul membuka dialog dengan informasi proyek. Galeri tersedia bila gambar ditambahkan. Tombol panah, keyboard kiri/kanan, swipe, thumbnail, dan Escape dapat digunakan.
- Sampul tipografi bawaan adalah identitas visual; **bukan screenshot aplikasi**. Ganti dengan screenshot asli melalui kolom gambar saat tersedia.
- Tulis gambar sebagai `assets/projects/nama-proyek/01.webp | Caption` atau URL HTTPS. Gambar pertama menjadi sampul. Maksimal 30 gambar dan 50 proyek, total metadata maksimal 150 KB.
- Isi proyek mandiri tidak dimaksudkan sebagai klaim kerja klien, kontrak komersial, atau afiliasi dengan perusahaan yang disebut di bagian pengalaman kerja.

## Foto dan unggahan

Foto telah diseleksi dengan latar transparan dan dikonversi menjadi WebP responsif. Foto bawaan tidak memerlukan Firebase Storage. Tombol **Gunakan foto bawaan V6** mengosongkan URL foto, lalu memulihkan foto bawaan setelah diterbitkan.

`storageEnabled` tetap `false` mengikuti paket awal. Artinya unggah langsung ke Firebase Storage belum aktif. Cara yang tersedia tanpa mengaktifkan layanan tambahan adalah mengunggah gambar melalui file manager hosting ke folder `assets`, lalu memasukkan path-nya di editor. URL HTTPS juga tersedia. Jika Storage diaktifkan kemudian, pengunggah foto mempertahankan proporsi dan transparansi; pemrosesan gambar proyek juga mempertahankan proporsi.

## Firebase dan rules

Paket ini tidak mengubah rules, akun, atau konten database online. Login dan penerbitan nyata perlu diuji oleh pemilik akun; tidak dilakukan dalam pengerjaan ini. Uji yang sudah dilakukan memakai mode lokal yang terisolasi.

Jika muncul `permission-denied`, periksa UID pemilik dan Firestore Rules yang sedang aktif. Dokumen yang digunakan adalah `portfolio/main`, dengan lima key di dalam `content`: `profile`, `contact`, `experience`, `projects`, dan `skills`. Field baru pada setiap proyek: `goal`, `approach`, `features`, `learning`. Bila rules Anda membatasi key tiap proyek, sesuaikan allowlist tersebut.

`firestore.rules.example` adalah contoh untuk database portofolio khusus; **bukan salinan rules aktif dan belum dijalankan pada emulator/backend**. Bandingkan dengan aturan aktif dan uji di Rules Playground sebelum menerapkannya. Jangan mengganti rules seluruh database bila Firebase tersebut juga melayani aplikasi/koleksi lain. Contoh tetap membatasi penulis ke UID pemilik, revision bertambah satu, server timestamp, dan tidak membuka penulisan publik.

Referensi: https://firebase.google.com/docs/firestore/security/rules-fields dan https://firebase.google.com/docs/firestore/security/test-rules-emulator

## Pemeriksaan yang dilakukan

- Syntax modul JavaScript dan validasi konten bawaan.
- Kompatibilitas proyek versi sebelumnya yang belum memiliki field detail.
- Penolakan URL tidak aman, ID proyek duplikat, batas fitur, dan periode tanggal tidak valid.
- Tampilan desktop dan lebar ponsel 390 px; menu mobile buka/tutup.
- Buka detail proyek; simpan draft dari editor dan tampilkan di pratinjau.
- Galeri dua gambar dan pindah ke gambar berikutnya.
- Tambah serta hapus proyek lokal; penyimpanan setelah perubahan.

Belum diverifikasi: login dengan akun pemilik, publish nyata, rules yang sedang aktif, serta unggahan Storage yang saat ini dinonaktifkan. Pemeriksaan langsung dokumen backend ditolak oleh peninjauan otomatis karena berpotensi mengakses data privat; pengerjaan dilanjutkan pada source yang diunggah dan tampilan publik yang sudah terlihat.

Aksesibilitas: dialog native dengan pengembalian fokus, label tombol, navigasi keyboard, fokus terlihat, skip link, dan dukungan preferensi reduced motion. Animasi memakai CSS dan Web Animations bawaan browser tanpa dependency animasi tambahan.
