# 🚀 ShortenLink - URL Shortener Modern

**ShortenLink** adalah aplikasi URL shortener modern yang dibangun dengan teknologi terkini. Aplikasi ini memungkinkan Anda memperpendek link panjang menjadi link pendek yang mudah dibagikan, dilengkapi dengan fitur QR code, analytics lengkap, dark mode, dan history management yang otomatis update.

![ShortenLink Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=ShortenLink+Preview)

## ✨ Fitur Utama

### 🔗 Shortening URL
- **Auto-generate** kode unik untuk setiap link
- **Validasi URL** yang ketat dengan Zod
- **Rate limiting** (10 requests/minute per IP)
- **Instant shortening** dalam hitungan detik
- **Format URL**: `domain.com/r/abc123`

### 📱 QR Code Generation
- **QR code otomatis** untuk setiap link pendek
- **Download QR** sebagai file PNG high-quality
- **Preview QR** dengan modal popup
- **QR code generation** menggunakan library qrcode

### 📊 Analytics Dashboard
- **Real-time metrics**: Total klik, pengunjung unik, click rate
- **Interactive charts**: Line chart untuk tren harian, pie chart untuk breakdown
- **Device analytics**: Mobile, desktop, tablet breakdown
- **Browser analytics**: Chrome, Firefox, Safari, dll
- **OS analytics**: Android, iOS, Windows, dll
- **Geographic data**: Country-wise statistics
- **Referrer tracking**: Source analysis lengkap
- **Time-series data**: Daily click trends
- **Export data**: CSV export functionality

### 🎨 User Experience
- **Modern UI/UX** dengan glass morphism design
- **Dark mode support** lengkap dengan next-themes
- **Responsive design** untuk semua device
- **Smooth animations** dan micro-interactions
- **Toast notifications** untuk feedback user
- **Loading states** dan error handling yang comprehensive
- **Real-time updates** untuk history tanpa refresh manual

### 📚 History Management
- **Local storage** untuk persistensi riwayat
- **Auto-update history** saat link baru dibuat
- **View history** dengan expand/collapse interface
- **Copy links** langsung dari history
- **Delete entries** individual atau clear all
- **QR code viewing** dari history
- **Analytics access** langsung dari history
- **Real-time synchronization** antar komponen

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 dengan App Router & Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: React Hooks + Custom Events
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theme**: next-themes

### Backend
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma 5.22+
- **API**: Next.js API Routes
- **Validation**: Zod
- **Authentication**: Tidak diperlukan (client-side only)

### Libraries & Tools
- **URL Shortening**: nanoid
- **QR Code**: qrcode
- **Notifications**: react-hot-toast
- **UI Components**: shadcn/ui
- **Build Tool**: Turbopack (Next.js 16)
- **CSS Framework**: Tailwind CSS v4
- **Animation**: CSS Animations + Tailwind

## 🚀 Instalasi & Menjalankan

### Persyaratan Sistem
- **Node.js** versi 18 atau lebih tinggi
- **npm** versi 8+ atau **yarn** atau **pnpm**

### Langkah Instalasi

1. **Clone repository** atau download project ini
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```

5. **Akses aplikasi**:
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda

## 📖 Cara Penggunaan

### 1. Shorten URL
1. Masukkan URL panjang di input field ("Enter your long URL here...")
2. Klik tombol "Shorten URL"
3. Tunggu proses shortening selesai
4. Copy link pendek (format: `domain.com/r/abc123`) atau download QR code

### 2. Melihat Analytics
1. Setelah shorten, klik "View Analytics"
2. Atau akses via history: klik tombol analytics pada item history
3. Lihat metrics real-time, charts interaktif, dan data lengkap
4. Export data ke CSV jika diperlukan

### 3. Mengelola History
1. History akan muncul otomatis di bagian bawah setelah shorten link pertama
2. Klik "Show History" untuk expand/collapse history
3. Copy link, lihat QR code, atau akses analytics langsung dari history
4. Hapus entry individual atau klik "Clear All" untuk bersihkan semua history
5. **History update otomatis** tanpa perlu refresh halaman

### 4. Dark Mode
- Klik tombol **moon/sun** di kanan atas untuk toggle dark mode
- Tema tersimpan secara otomatis di localStorage

## 🔧 API Documentation

### POST /api/shorten
**Shorten URL endpoint**

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url/that/needs/to/be/shortened"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "unique-id",
    "originalUrl": "https://example.com/very/long/url",
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/r/abc123",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

### GET /api/analytics/[shortCode]
**Get analytics data untuk link tertentu**

**Response:**
```json
{
  "link": {
    "shortUrl": "http://localhost:3000/r/abc123",
    "originalUrl": "https://example.com"
  },
  "totalClicks": 150,
  "uniqueVisitors": 120,
  "clicksByDate": {
    "2024-01-01": 10,
    "2024-01-02": 15
  },
  "deviceBreakdown": {
    "mobile": 80,
    "desktop": 40,
    "tablet": 30
  },
  "browserBreakdown": {
    "chrome": 100,
    "firefox": 30,
    "safari": 20
  },
  "osBreakdown": {
    "android": 70,
    "ios": 50,
    "windows": 30
  },
  "referrerBreakdown": {
    "direct": 50,
    "google.com": 40,
    "facebook.com": 30
  }
}
```

## 📁 Struktur Project

```
shortenlink/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── shorten/route.ts          # API shorten URL
│   │   │   └── analytics/[shortCode]/route.ts  # API analytics
│   │   ├── r/[shortCode]/
│   │   │   ├── page.tsx                 # Redirect handler (/r/abc123)
│   │   │   └── not-found.tsx            # 404 page untuk short links
│   │   ├── analytics/
│   │   │   ├── page.tsx                 # Analytics dashboard
│   │   │   └── [shortCode]/page.tsx     # Individual analytics
│   │   ├── globals.css                  # Global styles & animations
│   │   ├── layout.tsx                   # Root layout (English only)
│   │   └── page.tsx                     # Landing page
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   ├── link-form.tsx                # URL input form
│   │   ├── link-result.tsx              # Result display
│   │   ├── history.tsx                  # History management (auto-update)
│   │   ├── analytics-chart.tsx          # Chart components
│   │   ├── analytics-table.tsx          # Table components
│   │   ├── theme-toggle.tsx             # Dark mode toggle
│   │   └── error-boundary.tsx           # Error handling
│   └── lib/
│       ├── prisma.ts                    # Database client
│       ├── utils.ts                     # Utility functions
│       └── validators.ts                # Zod schemas
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── dev.db                          # SQLite database
├── public/                              # Static assets
├── next.config.ts                       # Next.js config (no i18n)
├── tailwind.config.ts                   # Tailwind CSS v4 config
├── postcss.config.mjs                   # PostCSS config
├── tsconfig.json                        # TypeScript config
├── eslint.config.mjs                    # ESLint config
└── package.json
```

## 🔒 Keamanan & Performansi

### Security Features
- **Input validation** dengan Zod schemas
- **Rate limiting** (10 requests/minute per IP)
- **SQL injection protection** via Prisma ORM
- **XSS protection** dengan proper sanitization
- **CSRF protection** dengan Next.js built-in

### Performance Optimizations
- **Database indexing** pada fields yang sering di-query
- **Lazy loading** untuk components besar
- **Image optimization** untuk QR codes
- **Caching strategies** untuk analytics data
- **Code splitting** dengan Next.js App Router

## 🚀 Deployment

### Vercel (Direkomendasikan)
1. Push code ke GitHub
2. Connect ke Vercel
3. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   ```
4. Deploy otomatis

### Manual Deployment
1. Build aplikasi:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

### Environment Variables
```env
DATABASE_URL="file:./dev.db"  # SQLite untuk development
# DATABASE_URL="postgresql://..."  # PostgreSQL untuk production
BASE_URL="http://localhost:3000"  # Untuk development
# BASE_URL="https://yourdomain.com"  # Untuk production
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

**Developer**: Rizqy Nurfauzella
**Email**: fauzella171@gmail.com
**GitHub**: [github.com/RizqyNurfauzella](https://github.com/RizqyNurfauzella)

## 🎯 Fitur Khusus

- **Real-time History Updates**: History terupdate otomatis tanpa refresh
- **English-only Interface**: UI yang bersih tanpa kompleksitas i18n
- **Optimized Routing**: Short URLs dengan prefix `/r/` untuk menghindari konflik
- **Modern Stack**: Next.js 16 + Turbopack + Tailwind CSS v4
- **Type-safe**: Full TypeScript dengan validasi Zod
- **Responsive**: Perfect di semua device dan screen size

---

**Dibuat dengan ❤️ menggunakan Next.js 16, TypeScript, dan Tailwind CSS v4**

⭐ **Jangan lupa beri star jika project ini bermanfaat!**
