# Admin Panel Setup Guide

## Akses Halaman Admin

**URL:** `/admin/chatbot-management`

Halaman ini tersembunyi dari navigasi publik dan terlindungi dengan password authentication.

## Fitur Utama

### 1. 📚 Knowledge Base Manager

- **Tambah Entry Baru**: Masukkan kategori, pertanyaan, dan jawaban
- **Edit Entry**: Update entry yang sudah ada
- **Hapus Entry**: Hapus entry yang tidak relevan
- **Filter & Search**: Cari entry berdasarkan kategori atau keywords

Setiap entry knowledge base akan digunakan oleh chatbot untuk memberikan response yang lebih akurat.

**Format Entry:**

- Category: Kategori pertanyaan (Product Info, General, etc)
- Question: Pertanyaan yang diharapkan user tanyakan
- Answer: Jawaban detail untuk pertanyaan tersebut
- Keywords: Keywords untuk membantu matching dengan pertanyaan user

### 2. 📦 Product Manager

- **Lihat Daftar Produk**: Semua produk dengan detail lengkap
- **Tambah Produk**: Tambahkan produk baru dengan form
- **Edit Produk**: Update detail produk yang sudah ada
- **Hapus Produk**: Hapus produk yang tidak lagi diproduksi
- **Filter Seri**: Filter produk berdasarkan seri (Laser, Moving Light, etc)
- **Cari Produk**: Search berdasarkan model, deskripsi, atau harga
- **Statistik**: Melihat summary produk (jumlah, harga range, dll)

Data produk dapat dikelola sepenuhnya melalui interface ini.

**Format Produk:**

- No: Nomor unik produk (tidak bisa diubah setelah dibuat)
- Seri: Kategori produk (Laser, Moving Light, Wash, Beam, Strobe, LED)
- Model: Nama model produk (e.g., MOXLITE HADES VI)
- Deskripsi: Spesifikasi teknis produk
- Harga: Harga dalam IDR (Rupiah Indonesia)
- Tag: Label optional untuk kategorisasi tambahan

### 3. ⚙️ Pengaturan Chatbot

- **Model AI Selection**: Pilih model AI yang digunakan (Gemini, GPT-4, etc)
- **Language Settings**: Atur bahasa response chatbot
- **Temperature**: Kontrol kreativitas response (0 = konsisten, 1 = kreatif)
- **Max Tokens**: Batasi panjang response
- **Top K & Top P**: Sampling parameters untuk output quality

Pengaturan tersimpan di localStorage dan akan digunakan chatbot.

## Keamanan

### Authentication

- **Default Password**: `admin123`
- **Token Storage**: Menggunakan sessionStorage (hilang saat browser ditutup)
- **API Protection**: Semua API endpoint memerlukan admin token

### Best Practices

1. Ubah password default di environment variables
2. Akses hanya saat diperlukan
3. Logout setelah selesai mengelola
4. Jangan share URL admin dengan orang yang tidak berhak
5. Monitor activity log secara berkala

## Environment Variables

Tambahkan ke `.env.local`:

```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_ADMIN_TOKEN=your_secure_token_here
```

## API Endpoints

### Knowledge Base Management

- **GET** `/api/admin/knowledge-base` - Get all entries
- **POST** `/api/admin/knowledge-base` - Create new entry
- **PUT** `/api/admin/knowledge-base` - Update entry
- **DELETE** `/api/admin/knowledge-base` - Delete entry

### Authentication

- **POST** `/api/admin/auth` - Login dengan password

## Usage Tips

### Menambah Knowledge Base Entry

1. Klik "Tambah Entry Baru"
2. Isi kategori (e.g., "Product Info", "General")
3. Masukkan pertanyaan yang mungkin user tanyakan
4. Tulis jawaban yang detail dan helpful
5. Tambahkan keywords untuk matching (optional)
6. Klik "Tambah Entry"

### Mengelola Produk

1. Klik tab **Produk**
2. Klik **+ Tambah Produk** untuk tambah produk baru
3. Isi form dengan detail produk:
   - No: Nomor unik (misal: 50)
   - Seri: Pilih dari dropdown
   - Model: Nama model lengkap
   - Deskripsi: Spesifikasi teknis
   - Harga: Harga dalam Rupiah
   - Tag: Optional untuk kategorisasi
4. Klik **Tambah Produk**

**Untuk Edit Produk:**

1. Cari produk di tabel
2. Klik tombol **Edit**
3. Update field yang diperlukan
4. Klik **Update Produk**

**Untuk Hapus Produk:**

1. Cari produk di tabel
2. Klik tombol **Hapus**
3. Confirm penghapusan

### Mengoptimalkan Respon Chatbot

1. Tambahkan entry untuk pertanyaan-pertanyaan umum
2. Gunakan keywords yang relevan untuk matching
3. Sesuaikan temperature sesuai kebutuhan:
   - Low (0.3-0.5): Untuk jawaban teknis/konsisten
   - Medium (0.7): Balanced
   - High (0.8-1.0): Untuk conversation yang lebih natural
4. Test response chatbot setelah update

### Troubleshooting

**Tidak bisa login:**

- Pastikan password benar
- Clear browser cache
- Check environment variables

**Knowledge base tidak terupdate:**

- Refresh page
- Check browser console untuk error
- Pastikan admin token valid

**Produk tidak tampil:**

- Ensure `productKnowledgeBase.ts` sudah diload
- Check CSV data di file tersebut

## Maintenance

### Backup Knowledge Base

1. Buka Knowledge Base Manager
2. Lihat daftar semua entry
3. Manual copy atau export untuk backup
4. Simpan di file terpisah

### Update Data Produk

1. Update CSV files di folder yang sesuai
2. Reload `productKnowledgeBase.ts`
3. Refresh admin panel untuk melihat perubahan

### Monitor Performance

- Check chatbot response time
- Monitor token usage
- Adjust max tokens jika diperlukan

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Bulk import/export KB entries
- [ ] Analytics dashboard
- [ ] A/B testing untuk response quality
- [ ] Rate limiting & audit logs
- [ ] Role-based access control
- [ ] Backup & restore functionality
- [ ] Knowledge base version control
