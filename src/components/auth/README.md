# Authentication Pages

Folder ini berisi halaman-halaman authentication untuk Moxlite.

## Struktur

```
auth/
├── index.tsx                    # Redirect ke login
├── login.tsx                    # Halaman login
├── signup.tsx                   # Halaman sign up
└── forgot-password.tsx          # Halaman reset password
```

## Halaman-halaman

### 1. Login (`/auth/login`)

- **File**: `login.tsx`
- **Component**: `LoginForm.tsx`
- **Fitur**:
  - Login dengan email dan password
  - Link "Forgot Password"
  - Login dengan Google (TODO: Implementasi OAuth)
  - Responsive design sesuai gambar UI
  - Form validation
  - Loading state

### 2. Sign Up (`/auth/signup`)

- **File**: `signup.tsx`
- **Component**: `SignupForm.tsx`
- **Fitur**:
  - Registrasi akun baru
  - Input: Full Name, Email, Password, Confirm Password
  - Password validation (minimal 8 karakter)
  - Sign up dengan Google (TODO: Implementasi OAuth)
  - Terms & Privacy Policy links
  - Link ke login page

### 3. Forgot Password (`/auth/forgot-password`)

- **File**: `forgot-password.tsx`
- **Component**: `ForgotPasswordForm.tsx`
- **Fitur**:
  - Reset password via email
  - Email verification
  - Success message dengan instruksi
  - Redirect ke login

## Styling

Semua halaman menggunakan:

- **Tailwind CSS** untuk styling
- **Dark gradient background** (slate-900 ke slate-700)
- **White form container** dengan rounded corners
- **Responsive design** (mobile-first)
- **Konsisten dengan UI design** pada gambar referensi

## API Endpoints (TODO)

Perlu implementasi endpoint berikut:

- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Registrasi
- `POST /api/auth/forgot-password` - Reset password
- `POST /api/auth/google` - Google OAuth (optional)

## Customization

Untuk mengubah styling:

1. Edit gradient colors di `bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700`
2. Edit button colors dan hover states
3. Edit form border dan focus states

## Fitur Tambahan yang Bisa Ditambahkan

1. Email verification pada signup
2. Two-factor authentication (2FA)
3. Social login (Google, GitHub, etc.)
4. Password strength indicator
5. Remember me functionality
6. Session management
7. CSRF protection

## Notes

- Semua form menggunakan `notistack` untuk notifications
- Loading states sudah terintegrasi
- Error handling sudah ada
- Responsive untuk mobile, tablet, dan desktop
