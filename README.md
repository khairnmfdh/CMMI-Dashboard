# 📊 CMMI & Radar Dashboard (Magang Telkom)

Selamat datang di repositori utama proyek **CMMI & Radar Dashboard**! Proyek ini dikembangkan khusus selama program Magang Telkom untuk mendigitalkan, memonitor, dan memvisualisasikan data penilaian CMMI (Capability Maturity Model Integration) serta data metrik *Radar Scraper* dari GitLab.

Proyek ini dibangun dengan arsitektur **Microservices (Monorepo terpisah)** yang memastikan skalabilitas dan performa tinggi.

---

## 🏗️ Arsitektur & Teknologi Utama

Sistem ini terbagi menjadi 3 pilar utama:

1. **Frontend (Dashboard UI)**
   - **Lokasi Folder:** `fe_dashboard/CMMI-Dashboard`
   - **Teknologi:** React.js, Vite, CSS Modules (Glassmorphism & Dark Mode Theme), Recharts (untuk visualisasi grafik interaktif).
   - **Fungsi:** Menampilkan laporan capaian setiap divisi, *Peer Review*, *Process QA*, dan *V&V* yang sudah terintegrasi dari API dan *Spreadsheet*.

2. **Backend (Core API)**
   - **Lokasi Folder:** `be_dashboard`
   - **Teknologi:** Go (Golang), GORM (ORM), Fiber / Gin.
   - **Fungsi:** Menyediakan RESTful API, membaca metrik dari basis data PostgreSQL, dan bertindak sebagai jembatan logika bisnis aplikasi.

3. **Database, Scraper & Analytics**
   - **Lokasi Folder:** `gitlab/be-dashboard-cmmi`
   - **Teknologi:** PostgreSQL (15 & 16), Metabase (Analytics Engine), Docker & Docker Compose, Python (untuk Scraper).
   - **Fungsi:** Menyimpan seluruh data *raw* secara persisten dan memfasilitasi pembuatan *query* analitik lanjutan.

---

## 📋 Prasyarat Sistem (*Prerequisites*)

Sebelum mulai berkontribusi atau menjalankan proyek ini, pastikan spesifikasi perangkat lunak berikut telah terpasang di komputermu:

- **Git** (untuk *version control* dan proses sinkronisasi kode).
- **Docker & Docker Compose** (wajib! digunakan untuk menjalankan seluruh *database* secara instan tanpa perlu instalasi Postgres manual).
- **Node.js** (versi 18.x atau lebih baru) dan `npm` untuk kompilasi *Frontend*.
- **Go / Golang** (versi 1.21 atau lebih baru) untuk proses kompilasi dan menjalankan *Backend*.

---

## 🚀 Panduan Menjalankan Aplikasi di Komputer Lokal (*Localhost*)

Karena proyek ini memiliki banyak pilar, kamu harus menjalankannya secara **berurutan**. Jika kamu baru pertama kali mencoba, ikuti instruksi *step-by-step* ini dengan saksama.

### Langkah 1: Kloning Repositori (*Git Clone*)
Pastikan kamu memiliki akses ke repositori GitHub Telkom. Buat satu folder utama (misal: `dashboard_cmmi`), lalu lakukan kloning untuk semua pilar proyek:
```bash
# Lakukan kloning untuk semua pilar proyek:
git clone https://github.com/khairnmfdh/CMMI-Dashboard.git fe_dashboard/CMMI-Dashboard
git clone https://github.com/FarhanFawwaz/be_dashboard.git be_dashboard
git clone https://gitlab.playcourt.id/live.comfarhan.fawwaz/be-dashboard-cmmi.git gitlab/be-dashboard-cmmi
```

*(Catatan: Untuk detail teknis mengenai cara kerja scraper dan konfigurasi Python, silakan baca `README.md` yang terdapat di dalam folder `gitlab/be-dashboard-cmmi` setelah melakukan kloning).*

### Langkah 2: Menyalakan Basis Data & Metabase (via Docker)
Sistem ini menggunakan dua instans basis data PostgreSQL yang berbeda. **Pastikan Docker Desktop sudah menyala di komputermu.**

**A. Nyalakan Database Utama (Backend)**
Database ini akan menyala di port `5432`.
```bash
cd be_dashboard
docker compose up -d
```

**B. Nyalakan Database Radar & Metabase (Scraper)**
Database sekunder ini akan menyala di port `5433` (untuk menghindari bentrok) dan antarmuka analitik Metabase di port `3000`.
```bash
cd ../gitlab/be-dashboard-cmmi
docker compose up -d
```
> 💡 **Tip:** Kamu bisa mengecek keberhasilan instalasi Metabase dengan membuka `http://localhost:3000`.
> - **Username:** `db_user`
> - **Password:** `db_password`

### Langkah 3: Konfigurasi & Menjalankan Backend (Golang)
Buka terminal baru (*new split terminal*). Sebelum menjalankan server, pastikan kamu memiliki file `.env` di dalam folder `be_dashboard`.

Contoh isi `.env`:
```env
PORT=8080
DB_NAME=dashboard.db
```

Jalankan perintah berikut:
```bash
cd be_dashboard
go mod tidy       # Mengunduh dependensi (hanya perlu dilakukan sekali)
go run main.go    # Menjalankan server
```
Jika sukses, akan muncul pesan di terminal bahwa *backend* berjalan di `http://localhost:8080`.

### Langkah 4: Menjalankan Frontend (React)
Buka terminal baru lagi.
```bash
cd fe_dashboard/CMMI-Dashboard
npm install       # Mengunduh dependensi node_modules (mungkin memakan waktu)
npm run dev       # Menjalankan web server Vite
```
🎉 **Selesai!** Buka *browser*-mu dan akses **`http://localhost:5173`**. Dashboard CMMI dengan desain *Dark Mode* siap digunakan!

---

## 🛠️ Penyelesaian Masalah (*Troubleshooting*)

Berikut adalah beberapa rintangan yang paling sering ditemui oleh tim pengembang saat pertama kali mencoba menjalankan aplikasi ini lokal:

1. **Error: `connectex: No connection could be made... target machine actively refused it` (Backend Golang)**
   - **Penyebab:** Kode Golang tidak bisa menemukan basis data.
   - **Solusi:** Kemungkinan besar kamu belum menjalankan `docker compose up -d` di folder `be_dashboard`, atau komputer baru saja di-*restart* sehingga penampung (*container*) Docker mati. Silakan nyalakan kembali Docker-nya.

2. **Tampilan Frontend Berantakan atau Kosong / Data Tidak Muncul**
   - **Penyebab:** *Frontend* tidak bisa mengambil data dari API *Backend*.
   - **Solusi:** Pastikan terminal yang menjalankan `go run main.go` masih aktif dan tidak *error*. 

3. **Port 5432 atau 8080 Bentrok (*Already in Use*)**
   - **Penyebab:** Ada aplikasi lain (seperti instalasi Postgres bawaan Windows atau XAMPP) yang sedang memakai porta tersebut.
   - **Solusi:** Matikan servis PostgreSQL bawaan sistem operasi melalui `services.msc` (Windows) atau paksa tutup aplikasi yang memakai port 8080.

---

## 🤝 Alur Kolaborasi (Untuk Mentor & Anggota Tim)
Bagi kamu yang ingin ikut mengembangkan fitur:
1. Pastikan selalu membuat *branch* baru dari `feat/api-integration` atau `main` (sesuai kebijakan). Contoh: `git checkout -b perbaikan-ui-grafik`.
2. Lakukan perubahan kode.
3. Jalankan pengujian lokal.
4. Lakukan *commit* dan *push*, lalu ajukan *Pull Request (PR)* agar kode di-*review* oleh rekan yang lain.

Dibuat dengan 💡 dan ☕ selama program Magang Telkom.
