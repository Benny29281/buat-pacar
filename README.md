# Untuk Rizky Ashria ♡

Website surat cinta dengan amplop interaktif, surat, kartu pesan, delapan pesan kecil, pelukan virtual, dan musik lembut buatan Web Audio. Responsif untuk HP dan desktop. Tidak perlu instalasi atau build.

## Lihat di komputer

Buka `index.html` langsung di browser. Jika menggunakan Laragon, buka `http://localhost/buat%20pacar/`.

## Pasang di GitHub Pages

1. Buat repository baru di GitHub, misalnya `untuk-rizky`.
2. Unggah `index.html`, `style.css`, `mobile.css`, dan `script.js` ke bagian paling luar repository (bukan di dalam folder tambahan).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch **main** dan folder **/ (root)**, lalu **Save**.
6. Tunggu GitHub selesai menerbitkan, lalu buka link yang ditampilkan di halaman Pages. Biasanya: `https://USERNAME.github.io/untuk-rizky/`.

Website yang diterbitkan dapat dibuka oleh siapa pun yang memiliki link. Jangan menambahkan informasi pribadi yang tidak ingin dipublikasikan.

## Pengalaman di HP

Halaman pembuka **Buka kejutanmu** memulai musik setelah disentuh agar sesuai aturan audio browser HP. Tombol **Suara on/off** mengatur musik dan semua efek suara. Ada bunyi lonceng ketika surat/kartu dibuka, animasi amplop, partikel hati, dan bagian halaman yang muncul saat digulir. Saat pindah tab, suara berhenti; sentuh tombol suara untuk menyalakannya lagi. Pengaturan kurangi gerakan di perangkat juga dihormati.

## Personalisasi

- Ubah isi surat dan nama penutup di `index.html` pada bagian `letter-content`.
- Ubah pesan kecil melalui daftar `messages` di `script.js`.
- Ubah warna melalui variabel di bagian atas `style.css`.

Font diambil dari Google Fonts ketika tersedia koneksi internet. Font bawaan browser menjadi cadangan. Semua interaksi dan musik berjalan di perangkat pengunjung; tidak ada akun, pelacakan, backend, atau kunci API.
