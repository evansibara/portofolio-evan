# Portfolio Admin Dashboard — Setup Guide

## Struktur File

```
src/
├── App.jsx                          ← Update dari original (tambah router + /admin route)
├── lib/
│   └── supabase.js                  ← Supabase client + service layer + SQL schema
├── hooks/
│   └── usePortfolioData.js          ← Hooks untuk fetch data dari Supabase
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.jsx       ← Layout utama admin (sidebar + topbar)
│   │   ├── AdminRoute.jsx           ← Auth guard + login form
│   │   ├── AdminUI.jsx              ← Shared UI components (form, modal, dll)
│   │   └── panels/
│   │       ├── OverviewPanel.jsx    ← Statistik + status koneksi
│   │       ├── SkillsPanel.jsx      ← CRUD skills
│   │       ├── ProjectsPanel.jsx    ← CRUD projects + upload gambar
│   │       ├── ExperiencePanel.jsx  ← CRUD pengalaman kerja
│   │       ├── CertificationsPanel.jsx ← CRUD sertifikasi + upload gambar
│   │       └── SettingsPanel.jsx    ← Profil + social links + toggle section
│   └── sections/
│       ├── Projects.jsx             ← Update: baca dari Supabase
│       ├── Experience.jsx           ← BARU: section pengalaman di portfolio
│       └── Certifications.jsx      ← BARU: section sertifikasi di portfolio
```

---

## Langkah Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js react-router-dom
```

### 2. Buat file .env

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Dapatkan dari: Supabase Dashboard → Project Settings → API

### 3. Setup Database (SQL Schema)

Buka **Supabase Dashboard → SQL Editor**, lalu jalankan SQL yang ada di dalam komentar file `src/lib/supabase.js`.

SQL tersebut akan membuat tabel:
- `skills`
- `projects`
- `experience`
- `certifications`
- `site_settings`

Dan storage bucket `portfolio-assets` untuk gambar.

### 4. Buat Akun Admin

Di **Supabase Dashboard → Authentication → Users**, klik "Add User" dan buat akun email + password untuk login ke admin dashboard.

### 5. Copy file-file ini ke project portfolio

Salin semua file dari folder ini ke project portfolio kamu sesuai path-nya.

Kemudian update `App.jsx` dengan versi baru yang ada di sini (menambahkan `BrowserRouter` dan route `/admin`).

### 6. Tambahkan Section Baru ke Portfolio

Di `App.jsx` dalam `PortfolioPage`, tambahkan:

```jsx
import Experience from './components/sections/Experience';
import Certifications from './components/sections/Certifications';

// Di dalam <main>:
<Hero />
<TechStack />
<Projects />
<Experience />       {/* BARU */}
<Certifications />   {/* BARU */}
```

### 7. Jalankan & Test

```bash
npm run dev
```

- **Portfolio**: http://localhost:5173/
- **Admin**: http://localhost:5173/admin

---

## Fitur Admin Dashboard

| Panel | Fitur |
|-------|-------|
| Overview | Statistik konten, status Supabase |
| Skills | CRUD + level bar + kategori filter |
| Projects | CRUD + upload gambar + filter kategori + featured toggle |
| Pengalaman | CRUD + expandable card + is_current toggle |
| Sertifikasi | CRUD + upload gambar/badge + link verifikasi |
| Site Settings | Profil, social links, toggle section visibility |

## Upload Gambar

Gambar di-upload ke **Supabase Storage** bucket `portfolio-assets`:
- Projects → folder `projects/`
- Sertifikasi → folder `certifications/`

URL gambar tersimpan di kolom `image_url` di masing-masing tabel dan langsung dipakai di portfolio frontend.

## Security

- Admin dashboard di-protect dengan Supabase Auth
- RLS (Row Level Security) aktif: read public, write hanya authenticated
- Akses `/admin` tanpa login otomatis redirect ke halaman login
