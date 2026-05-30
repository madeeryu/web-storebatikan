# Batik AN — E-Commerce Setup Guide

> **"Warisan Budaya Modern"**  
> Toko batik online dengan tema elegan bernuansa Jawa.  
> Tech stack: Next.js 14 · Firebase · Tailwind CSS · Vercel

---

## ✅ Prasyarat

Pastikan sudah terinstal:
- **Node.js** v18+ — [download](https://nodejs.org)
- **npm** v9+ (sudah include dengan Node.js)
- **Git** — [download](https://git-scm.com)
- Akun **Firebase** — [console.firebase.google.com](https://console.firebase.google.com)
- Akun **Vercel** — [vercel.com](https://vercel.com)
- Akun **GitHub**

---

## 1. Clone & Install

```bash
git clone https://github.com/username/batik-an.git
cd batik-an
npm install
```

---

## 2. Setup Firebase

### 2a. Buat Project Firebase

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Klik **"Add project"** → beri nama: `batik-an`
3. Nonaktifkan Google Analytics (opsional)
4. Klik **"Create project"**

### 2b. Enable Firestore Database

1. Di sidebar kiri: **Build → Firestore Database**
2. Klik **"Create database"**
3. Pilih mode **"Production"**
4. Pilih region terdekat (contoh: `asia-southeast1` untuk Singapore)
5. Klik **"Done"**

### 2c. Enable Firebase Storage

1. Di sidebar kiri: **Build → Storage**
2. Klik **"Get started"**
3. Pilih mode **"Production"**
4. Pilih region yang **sama** dengan Firestore
5. Klik **"Done"**

### 2d. Enable Authentication

1. Di sidebar kiri: **Build → Authentication**
2. Klik **"Get started"**
3. Tab **"Sign-in method"** → Enable **"Email/Password"**
4. Klik **"Save"**

### 2e. Buat Akun Admin Pertama

1. Masih di Authentication → Tab **"Users"**
2. Klik **"Add user"**
3. Isi email dan password yang kuat
   - Contoh email: `admin@batikan.com`
   - Gunakan password minimal 12 karakter
4. Klik **"Add user"**

> ⚠️ Simpan email & password ini dengan aman. Ini adalah satu-satunya cara masuk ke admin panel.

### 2f. Ambil Firebase Credentials

1. Di sidebar kiri: **Project Settings** (ikon gear)
2. Tab **"General"** → scroll ke bawah ke **"Your apps"**
3. Klik **"Add app"** → pilih ikon **Web** (`</>`)
4. Beri nama: `batik-an-web`
5. **Jangan** centang Firebase Hosting
6. Klik **"Register app"**
7. Salin konfigurasi yang muncul

### 2g. Konfigurasi Environment Variables

```bash
# Salin template
cp .env.local.example .env.local

# Edit dengan editor favorit Anda
nano .env.local   # atau: code .env.local
```

Isi `.env.local` dengan nilai dari Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=batik-an-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=batik-an-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=batik-an-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_SITE_URL=https://storebatikan.vercel.app
```

### 2h. Deploy Firestore Security Rules

```bash
# Install Firebase CLI (jika belum ada)
npm install -g firebase-tools

# Login
firebase login

# Inisialisasi (pilih Firestore & Storage saja)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Deploy indexes (penting untuk performa query!)
firebase deploy --only firestore:indexes
```

> Atau copy-paste isi `firestore.rules` dan `storage.rules` manual di Firebase Console.

---

## 3. Jalankan Secara Lokal

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 4. Inisialisasi Data Settings Pertama

Setelah app berjalan lokal:

1. Buka [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login dengan akun admin yang dibuat di langkah 2e
3. Pergi ke menu **Pengaturan**
4. Isi:
   - **Nama Toko**: Batik AN
   - **Tagline**: Warisan Budaya Modern
   - **Nomor WhatsApp**: `628xxxxxxx` (format tanpa + dan tanda baca)
   - **Instagram**: username tanpa @
5. Klik **"Simpan Pengaturan"**

Ini akan otomatis membuat dokumen `settings/config` di Firestore.

---

## 5. Mulai Isi Konten Toko

Urutan yang disarankan:

```
1. Admin → Kategori     → Tambah minimal 1 kategori
2. Admin → Produk       → Tambah produk pertama
3. Admin → Banner       → Upload banner homepage (1920×700px)
4. Admin → Promo        → Buat promo (opsional)
```

---

## 6. Deploy ke Vercel

### 6a. Push ke GitHub

```bash
git add .
git commit -m "Initial commit: Batik AN e-commerce"
git push origin main
```

### 6b. Import ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Git Repository"**
3. Pilih repo `batik-an`
4. Di bagian **"Environment Variables"**, tambahkan semua variabel dari `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_SITE_URL`
5. Klik **"Deploy"**

### 6c. Setup Custom Domain (Opsional)

1. Di Vercel → Project → **"Settings"** → **"Domains"**
2. Tambahkan domain custom jika ada
3. Atau gunakan URL default: `storebatikan.vercel.app`

---

## 7. Setelah Deploy

| URL | Fungsi |
|-----|--------|
| `storebatikan.vercel.app` | Halaman utama toko |
| `storebatikan.vercel.app/produk` | Semua produk |
| `storebatikan.vercel.app/admin` | Login admin |
| `storebatikan.vercel.app/admin/dashboard` | Dashboard admin |

---

## 8. Panduan Admin Panel

### Tambah Produk
1. Admin → **Produk** → **"+ Tambah Produk"**
2. Isi nama, deskripsi, harga, pilih kategori
3. Upload foto (bisa multiple, drag & drop)
4. Tambah varian warna dan ukuran
5. Toggle **"Aktif"** → Klik **"Simpan"**

### Upload Banner Homepage
1. Admin → **Banner** → **"+ Tambah Banner"**
2. Upload gambar ukuran **1920×700px** (landscape)
3. Isi judul, subtitle, teks CTA (opsional)
4. Set **Order**: 1 untuk banner pertama di slider
5. Toggle **"Aktif"** → Klik **"Simpan"**

### Approve Review
1. Admin → **Review** → Tab **"Menunggu Persetujuan"**
2. Klik **"Setujui"** untuk review yang layak tayang
3. Atau klik **"Hapus"** untuk review spam/tidak relevan

### Buat Promo
1. Admin → **Promo & Diskon** → **"+ Buat Promo"**
2. Isi nama promo, persentase diskon
3. Pilih berlaku untuk: Semua / Kategori tertentu / Produk tertentu
4. Set tanggal mulai & selesai
5. Toggle **"Aktif"** → Klik **"Simpan"**

---

## 9. Struktur Folder

```
batik-an/
├── app/
│   ├── (public)/         → Halaman customer
│   ├── (admin)/          → Admin panel
│   ├── robots.ts         → robots.txt auto-generated
│   └── sitemap.ts        → sitemap.xml dinamis
├── components/
│   ├── ui/               → shadcn + custom components
│   ├── layout/           → Navbar, Footer, AdminSidebar
│   ├── home/             → Section homepage
│   ├── product/          → ProductCard, Gallery, dll
│   ├── cart/             → Cart & Checkout
│   └── admin/            → Admin forms
├── lib/
│   ├── firebase.ts       → Firebase init
│   ├── firestore.ts      → CRUD functions
│   ├── storage.ts        → Upload/delete
│   ├── auth.ts           → Auth helpers
│   ├── metadata.ts       → SEO metadata
│   ├── pagination.ts     → Firestore cursor pagination
│   └── utils.ts          → Helper functions
├── hooks/
│   ├── useCart.ts        → Cart state (Zustand)
│   ├── useWishlist.ts    → Wishlist (localStorage)
│   └── useAuth.ts        → Admin auth state
├── types/
│   └── index.ts          → TypeScript types
├── firestore.rules       → Firestore security rules
├── firestore.indexes.json → Composite indexes
├── storage.rules         → Storage security rules
├── next.config.js        → Next.js config
└── .env.local.example    → Environment template
```

---

## 10. Tips & Troubleshooting

### Build error: "Firebase app not initialized"
→ Pastikan semua variabel di `.env.local` sudah terisi dengan benar.

### Gambar tidak muncul setelah upload
→ Pastikan Firebase Storage rules sudah di-deploy dan `firebasestorage.googleapis.com` ada di `next.config.js` `remotePatterns`.

### Admin tidak bisa login
→ Cek email & password di Firebase Console → Authentication → Users.  
→ Pastikan provider Email/Password sudah di-enable.

### Query Firestore lambat
→ Deploy `firestore.indexes.json` via `firebase deploy --only firestore:indexes`

### Sitemap tidak update
→ Sitemap di-generate saat build. Re-deploy atau tambahkan `revalidate` pada route sitemap.

---

## 11. Final Checklist Sebelum Launch

- [ ] Homepage tampil dengan benar (hero, section produk, kategori)
- [ ] Halaman `/produk` menampilkan grid + filter berfungsi
- [ ] Halaman detail produk: gallery, varian, review form
- [ ] Cart: tambah produk, ubah qty, hapus
- [ ] Checkout WA: format pesan benar, nomor dari settings
- [ ] Wishlist: toggle dari ProductCard, tampil di `/wishlist`
- [ ] Admin login berfungsi, redirect ke dashboard
- [ ] Admin: CRUD produk dengan upload foto
- [ ] Admin: CRUD kategori dengan upload gambar
- [ ] Admin: CRUD banner
- [ ] Admin: CRUD promo
- [ ] Admin: approve/reject review
- [ ] Admin: update pengaturan (WA number, dll)
- [ ] Route `/admin/*` protected (redirect jika belum login)
- [ ] Responsive di mobile (375px)
- [ ] `npm run build` berhasil tanpa error
- [ ] Deploy ke Vercel berhasil
- [ ] Firestore rules & indexes sudah di-deploy
- [ ] robots.txt & sitemap.xml accessible

---

## 12. Kontak & Support

Dibuat dengan ❤️ untuk **Batik AN** — Warisan Budaya Modern.

---

*Last updated: 2025*
