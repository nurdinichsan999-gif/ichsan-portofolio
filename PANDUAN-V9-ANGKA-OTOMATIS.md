# Portofolio V9 — Angka otomatis

Unggah seluruh isi folder `website/` ke hosting, termasuk folder assets dan berkas tersembunyi .htaccess. Tidak perlu mengganti aturan Firebase atau mengimpor ulang konten. Data yang sudah diterbitkan tetap dipakai.

## Cara kerja

- Jumlah proyek mengikuti seluruh daftar proyek dalam editor, termasuk semua kategori.
- Tahun operasional dan freelance mengikuti tanggal mulai dan selesai pada Pengalaman. Tanggal selesai kosong berarti masih berjalan hingga bulan sekarang (zona waktu Jakarta).
- Periode yang tumpang tindih dihitung satu kali; jeda antarpekerjaan tidak dihitung.
- Angka menampilkan tahun penuh dengan tanda +. Durasi di bawah setahun tampil <1; tanpa pengalaman tampil 0. Arahkan kursor ke angka untuk melihat tahun dan bulan.
- Perhitungan diperbarui saat data dimuat, setiap jam ketika halaman terlihat, dan saat kembali ke tab. Pekerjaan yang sudah selesai tidak bertambah durasinya.

## Editor

Di bawah Angka hero terdapat pratinjau yang langsung mengikuti draft tanggal dan daftar proyek, beserta sumber pengelompokannya. Simpan/terbitkan agar perubahan data dipakai halaman publik.

Pengalaman freelance dikenali dari kata freelance, freelancer, atau pekerja lepas pada jabatan, detail, atau perusahaan. Operasional dikenali dari operations, operasional, QC Content, Content Agent, atau KYC pada jabatan/detail. Periksa daftar kelompok dalam pratinjau agar sesuai.

Label lama yang menyebut proyek, tahun operasional, dan tahun freelance otomatis dikenali. Jika ingin mengganti label secara bebas, gunakan format berikut pada Angka hero:

```
{operationsYears} | Tahun pengalaman operasional
{projectCount} | Proyek pribadi
{freelanceYears} | Tahun pengalaman freelance
```

Untuk terjemahan English khusus, gunakan token yang sama pada kolom terjemahannya. Angka lain dengan label khusus tetap dapat diisi manual. Maksimal empat baris.

Pratinjau lokal memakai data browser dan tidak menulis ke Firebase. Domain asli berubah setelah paket diunggah ke hosting Anda.
