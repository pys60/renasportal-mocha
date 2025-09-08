# Renas Akademi - Danışmanlık Web Sitesi

Modern danışmanlık firması için geliştirilmiş tam yığın web uygulaması.

## 🚀 Teknolojiler

### Frontend
- **React 19** - Modern kullanıcı arayüzü
- **TypeScript** - Tip güvenli geliştirme
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Vite** - Hızlı geliştirme ortamı

### Backend
- **Node.js + Express** - Server framework
- **PostgreSQL** - Veritabanı
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## 📋 Gereksinimler

- Node.js 18+
- PostgreSQL 12+
- npm veya yarn

## 🛠️ Kurulum

1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd renas-akademi
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın**
   ```bash
   cp .env.example .env
   ```
   `.env` dosyasını editleyerek PostgreSQL bağlantı bilgilerinizi girin.

4. **Veritabanını hazırlayın**
   
   PostgreSQL veritabanınızda `src/server/database.sql` dosyasını çalıştırın:
   ```bash
   psql -h your-host -U your-username -d your-database -f src/server/database.sql
   ```
   
   Veya pgAdmin, DBeaver gibi GUI araçlarla SQL dosyasını import edin.

5. **Uygulamayı başlatın**
   ```bash
   npm run dev
   ```
   
   Bu komut hem frontend'i (http://localhost:5173) hem de backend'i (http://localhost:3000) başlatır.

## 📊 Veritabanı Yapısı

- **settings** - Tema ve uygulama ayarları
- **pages** - Web sitesi sayfaları (hiyerarşik yapı)
- **blog_posts** - Blog yazıları
- **services** - Hizmet katalogu
- **contact_submissions** - İletişim form gönderileri

## 🔧 Geliştirme

### Frontend Geliştirme
```bash
npm run dev:client
```

### Backend Geliştirme
```bash
npm run dev:server
```

### Build İçin
```bash
npm run build
npm run build:server
```

### Production'da Çalıştırma
```bash
npm start
```

## 📁 Proje Yapısı

```
src/
├── react-app/          # Frontend React uygulaması
│   ├── components/     # Yeniden kullanılabilir bileşenler
│   ├── pages/         # Sayfa bileşenleri
│   ├── contexts/      # React context'leri
│   └── hooks/         # Custom hooks
├── server/            # Backend Express sunucusu
│   ├── index.ts       # Ana sunucu dosyası
│   └── database.sql   # Veritabanı şeması
└── shared/            # Paylaşılan tipler ve şemalar
    └── types.ts       # Zod şemaları ve TypeScript tipleri
```

## 🎨 Özellikler

- **Tema Sistemi** - Turkuaz ve Gri-Yeşil temalar
- **Admin Paneli** - İçerik yönetimi için
- **Hiyerarşik Sayfalar** - Ana sayfa ve alt sayfa yapısı
- **Blog Sistemi** - Makale yönetimi
- **Hizmet Katalogu** - Kategorize edilmiş hizmetler
- **İletişim Formu** - Müşteri mesajları
- **Responsive Tasarım** - Mobil uyumlu
- **SEO Dostu** - Meta description desteği

## 🔐 Güvenlik

- CORS yapılandırması
- Input validation (Zod)
- SQL injection koruması (Parameterized queries)
- XSS koruması

## 📝 Ortam Değişkenleri

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

1. **Sunucu hazırlığı**
   - Node.js 18+ kurulu olmalı
   - PostgreSQL veritabanı erişimi

2. **Environment variables**
   - Production ortamında `.env` dosyasını uygun değerlerle oluşturun
   - `NODE_ENV=production` ayarlayın

3. **Build ve start**
   ```bash
   npm install
   npm run build
   npm run build:server
   npm start
   ```

## 📞 Destek

Herhangi bir sorun yaşarsanız, lütfen issues bölümünden bildirin.
