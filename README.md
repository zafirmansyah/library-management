# Library Management System - Backend

## 📌 Deskripsi
Library Management System adalah sistem manajemen perpustakaan yang dikembangkan menggunakan **NestJS** dan **TypeORM**. Aplikasi ini memungkinkan pengguna untuk mengelola buku, melakukan peminjaman, serta mencatat mutasi stok buku.

---

## 🚀 Fitur Utama
1. **Manajemen Buku**
   - Tambah, lihat, edit, dan hapus buku.
   - Integrasi dengan **Open Library API** untuk pencarian berdasarkan ISBN.
2. **Peminjaman dan Pengembalian Buku**
   - Meminjam buku jika stok tersedia.
   - Mengembalikan buku dan memperbarui stok secara otomatis.
3. **Mutasi Stok Buku**
   - Catatan transaksi peminjaman dan pengembalian.
   - Mencatat stok masuk dan keluar.
4. **Autentikasi dan Otorisasi**
   - Pengguna harus login sebelum dapat meminjam buku.
   - Role-based access control (Admin, User, Guest).
5. **API Documentation**
   - API didokumentasikan menggunakan **Swagger**.

---

## ⚙️ Teknologi yang Digunakan
- **Backend:** NestJS (TypeScript) + TypeORM
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **External API:** Open Library API
- **Documentation:** Swagger
- **Containerization:** Docker

---

## 🔧 Instalasi dan Setup
### 1️⃣ Clone Repository
```bash
git clone https://gitlab.com/erzethones/library-management
cd library-management
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Konfigurasi Environment
Buat file `.env` dan isi dengan konfigurasi berikut:
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=library_db
JWT_SECRET=mysecretkey
OPEN_LIBRARY_API=https://openlibrary.org/api/
```

### 4️⃣ Jalankan Database dengan Docker
```bash
docker-compose up -d
```

### 5️⃣ Jalankan Migration
```bash
npx typeorm migration:run
```

### 6️⃣ Start Aplikasi
```bash
npm run start:dev
```

---

## 📡 API Endpoints
### 📚 Buku
| Method | Endpoint       | Deskripsi              |
|--------|--------------|------------------------|
| GET    | /books       | Mendapatkan semua buku |
| GET    | /books/:id   | Mendapatkan buku spesifik |
| POST   | /books       | Menambahkan buku baru |
| PATCH  | /books/:id   | Mengupdate buku |
| DELETE | /books/:id   | Menghapus buku |

### 🔄 Peminjaman
| Method | Endpoint       | Deskripsi |
|--------|--------------|------------|
| POST   | /books/borrow/:id | Meminjam buku |
| POST   | /books/return/:id | Mengembalikan buku |

---

## 🔍 Integrasi Open Library API
Aplikasi ini terintegrasi dengan **Open Library API** untuk mendapatkan informasi buku berdasarkan ISBN. Contoh request:
```bash
GET https://openlibrary.org/api/books?bibkeys=ISBN:9780140328721&format=json
```

---

## 📜 Lisensi
MIT License

---

## 🤝 Kontribusi
Jika ingin berkontribusi pada proyek ini, silakan buat **pull request** atau buka **issue** baru.

---

## 📞 Kontak
Jika ada pertanyaan, silakan hubungi: [rezafirmansyah2295@gmail.com](mailto:rezafirmansyah2295@gmail.com)
