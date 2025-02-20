# Kelompok B3_08

## Anggota
1. **Cornelius Arden Satwika Hermawan** - 22/505482/TK/55313 (Project Manager & AI Engineer)
2. **Adzka Bagus Juniarta** - 22/500276/TK/54824 (Cloud Engineer & Software Engineer)
3. **Dhimas Nurhanindya Putra** - 22/505433/TK/55309 (UI/UX Designer & Software Engineer)

## "Projek Senior Project TI"
**Departemen Teknologi Elektro dan Teknologi Informasi, Fakultas Teknik, Universitas Gadjah Mada**

## Nama Produk
**Kenal.In**

## Jenis Produk
**Web App**

## Latar Belakang
Dalam berbagai organisasi dan perusahaan, pencatatan kehadiran merupakan aspek penting dalam manajemen sumber daya manusia. Metode konvensional seperti absensi manual, kartu ID, atau fingerprint sering kali tidak efisien, memakan waktu, dan rentan terhadap kesalahan atau penyalahgunaan. Selain itu, kebutuhan akan sistem yang lebih cepat, aman, dan minim kontak semakin meningkat, terutama dalam situasi yang menuntut efisiensi operasional. Dengan kemajuan teknologi pengenalan wajah, hadir solusi yang dapat mengotomatiskan proses absensi dengan lebih akurat, mengurangi risiko human error, serta meningkatkan efisiensi dalam pengelolaan data kehadiran.

## Rumusan Masalah
Bagaimana mengembangkan sistem absensi otomatis berbasis teknologi pengenalan wajah yang dapat mencatat kehadiran secara real-time, meningkatkan keamanan data, serta memberikan kemudahan bagi organisasi dalam mengelola daftar kehadiran secara efisien?

## Ide Solusi
**Kenal.in** hadir sebagai solusi presensi otomatis berbasis teknologi pengenalan wajah. Dengan **Kenal.in**, organisasi dapat mendaftarkan wajah karyawan atau peserta yang akan hadir dalam suatu acara. Saat proses absensi, peserta cukup berdiri di depan perangkat yang telah disiapkan, seperti laptop dengan kamera, tanpa perlu menggunakan kartu ID atau fingerprint. Sistem akan mengenali wajah yang telah terdaftar dan mencatat kehadiran secara otomatis. Data kehadiran tersimpan dengan aman dan dapat diekspor dalam format Excel untuk memudahkan pengelolaan administrasi. Dengan pendekatan ini, **Kenal.in** tidak hanya meningkatkan efisiensi absensi tetapi juga menghadirkan solusi yang lebih aman, cepat, dan bebas kontak bagi organisasi dan perusahaan.

## Rancangan Fitur

| **Fitur** | **Keterangan** |
|-----------|---------------|
| **Pendaftaran Wajah** | Memungkinkan organisasi untuk mendaftarkan wajah karyawan atau peserta yang akan hadir. Data wajah yang telah terdaftar akan digunakan untuk verifikasi identitas saat proses absensi. |
| **Absensi Otomatis** | Menggunakan teknologi pengenalan wajah, sistem secara otomatis mencatat kehadiran peserta yang wajahnya telah terdaftar dalam database. |
| **Penyimpanan Data Kehadiran** | Data kehadiran yang tercatat secara otomatis akan disimpan dengan aman dalam sistem, memastikan informasi kehadiran selalu terorganisir dan mudah diakses. |
| **Ekspor Daftar Kehadiran** | Pengguna dapat mengunduh daftar kehadiran dalam format Excel untuk kebutuhan administrasi dan laporan lebih lanjut. |

## Analisis Kompetitor

### 1. Talenta.co
- **Jenis Kompetitor:** Direct
- **Jenis Produk:** Face Recognition
- **Target Customer:** Pemilik Bisnis, Pelaku Organisasi
- **Kelebihan:**
  - Terdapat fitur liveness detection
  - Dashboard untuk admin
- **Kekurangan:**
  - Pricing terlalu mahal
  - Kecepatan face recognition kurang
- **Key Competitive Advantage & Unique Value:**
  - Tersedia demo interaktif yang memungkinkan evaluasi langsung terhadap fitur liveness validation. 

### 2. 3DiVi
- **Jenis Kompetitor:** Direct
- **Jenis Produk:** AI Product
- **Target Customer:** Owner bisnis, Perusahaan Teknologi, Tech Enthusiast
- **Kelebihan:**
  - Banyak pilihan AI Product seperti face recognition, emotion detection, dll.
  - Bisa menggunakan layanan mereka dalam bentuk API
  - Support cross-platform di Windows, Linux, Mac, dan Android
- **Kekurangan:**
  - Produk hanya tersedia dalam bentuk API, bukan aplikasi siap pakai
- **Key Competitive Advantage & Unique Value:**
  - Menawarkan model AI yang robust dengan integrasi ke berbagai platform.
  - Memberikan 14 hari percobaan untuk mencoba produk-produk mereka.

### 3. Jibble
- **Jenis Kompetitor:** Direct
- **Jenis Produk:** Aplikasi absensi berbasis pengenalan wajah
- **Target Customer:** Perusahaan dari berbagai skala yang membutuhkan sistem pencatatan kehadiran karyawan yang efisien dan akurat
- **Kelebihan:**
  - Antarmuka yang ramah pengguna
  - Menyediakan fitur pelacakan lokasi GPS dan geofencing
- **Kekurangan:**
  - Beberapa fitur lanjutan memerlukan biaya tambahan atau tidak tersedia dalam versi gratis
  - Ketergantungan pada koneksi internet yang stabil
- **Key Competitive Advantage & Unique Value:**
  - Sistem absensi face recognition gratis tanpa batasan pengguna
  - Integrasi fitur pelacakan lokasi dan geofencing

## Metodologi SDLC
### **Metodologi yang digunakan**
**Agile Model**

### **Alasan pemilihan metodologi**
Karena fleksibilitasnya dalam menghadapi perubahan dan pengembangan fitur secara bertahap. Sistem ini melibatkan teknologi pengenalan wajah yang memerlukan pengujian dan penyempurnaan berulang agar akurasinya optimal. Agile memungkinkan pengembangan yang lebih cepat melalui iterasi kecil, sehingga setiap fitur seperti pendaftaran wajah, absensi otomatis, dan ekspor data bisa diuji dan disempurnakan sebelum implementasi penuh. Selain itu, Agile mendukung kolaborasi tim multidisiplin, mempercepat respons terhadap kebutuhan pasar, dan memastikan integrasi teknologi berjalan dengan baik. Agile lebih efektif dalam menangani tantangan teknis dan perubahan yang mungkin terjadi selama proses pengembangan dibandingkan dengan Waterfall.

## Perancangan Tahap 1-3 SDLC
### **Tujuan dari Produk**
Kenal.in bertujuan untuk menyediakan solusi absensi otomatis berbasis teknologi pengenalan wajah. Sistem ini dirancang untuk mencatat kehadiran secara real-time dengan lebih akurat, meningkatkan keamanan data, serta memberikan kemudahan bagi organisasi ataupun perusahaan dalam mengelola daftar kehadiran secara efisien. Kenal.in bertujuan untuk menggantikan metode absensi konvensional yang tidak efisien dan rentan terhadap penyalahgunaan serta kesalahan pengelolaan absensi.

### **Pengguna Potensial dari Produk dan Kebutuhan Para Pengguna**
#### **Pengguna Potensial:**
- **Perusahaan dan Organisasi:** Membutuhkan sistem absensi yang efisien, akurat, serta minim kontak untuk meningkatkan produktivitas dan mempermudah mengelola manajemen kehadiran karyawan.
- **Penyelenggara Acara:** Membutuhkan sistem absensi yang cepat dan praktis untuk mencatat kehadiran peserta maupun panitia tanpa hambatan.
- **Sekolah atau Institusi Pendidikan:** Membutuhkan sistem pencatatan kehadiran otomatis untuk memudahkan administrasi dan menghindari absensi manual yang rentan terhadap manipulasi.

## Use Case Diagram
![Use Case Diagram](https://raw.githubusercontent.com/senpro-B3-08/Kenal.In/main/docs/images/usecase-diagram.png)

## Functional Requirements untuk Use Case yang Telah Dirancang

| **FR**  | **Deskripsi**  |
|---------|---------------|
| FR 1    | Sistem harus memungkinkan user untuk mendaftarkan wajah mereka menggunakan teknologi pengenalan wajah.  |
| FR 2    | Sistem harus memungkinkan user untuk melakukan presensi dengan memverifikasi wajah mereka yang telah terdaftar.  |
| FR 3    | Sistem harus memungkinkan user untuk mengedit data wajah yang telah terdaftar.  |
| FR 4    | Sistem harus memungkinkan admin untuk membuat event baru dalam sistem.  |
| FR 5    | Sistem harus memungkinkan admin untuk mengunduh data presensi dari event yang telah dibuat.  |


## Entity Relationship Diagram
![ERD](https://raw.githubusercontent.com/senpro-B3-08/Kenal.In/main/docs/images/ERD.png)

## Low-Fidelity Wireframe
### **1. Halaman Pendaftaran Wajah**
![Lofi Register](https://raw.githubusercontent.com/senpro-B3-08/Kenal.In/main/docs/images/lofi-registerface.png)
### **2. Halaman Absensi Menggunakan Pengenalan Wajah**
![Lofi Absensi](https://raw.githubusercontent.com/senpro-B3-08/Kenal.In/main/docs/images/lofi-photo.png)

## Gantt Chart Pengerjaan Proyek (1 Semester)
![Gantt Chart](https://raw.githubusercontent.com/senpro-B3-08/Kenal.In/main/docs/images/gantchart.png)
