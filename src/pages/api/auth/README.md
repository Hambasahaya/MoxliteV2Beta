# Authentication API Endpoints

Dokumentasi lengkap untuk API endpoints authentication di `/api/auth/`.

## Endpoints

### 1. Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (200):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses**:

- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

---

### 2. Sign Up

**Endpoint**: `POST /api/auth/signup`

**Request Body**:

```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (201):

```json
{
  "message": "Account created successfully"
}
```

**Error Responses**:

- `400`: Invalid input or user already exists
- `500`: Server error

**Validations**:

- Email must be valid format
- Password must be at least 8 characters
- Email must be unique

---

### 3. Forgot Password

**Endpoint**: `POST /api/auth/forgot-password`

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):

```json
{
  "message": "If an account exists, a reset link has been sent"
}
```

**Note**: Always returns 200 for security (tidak memberi tahu apakah email terdaftar atau tidak)

---

## Implementation TODO

### Priority 1 (Essential)

- [ ] Database schema untuk users
- [ ] Password hashing (bcrypt)
- [ ] JWT token generation dan validation
- [ ] Email sending service

### Priority 2 (Important)

- [ ] Email verification
- [ ] Password reset flow
- [ ] Session management
- [ ] CSRF protection

### Priority 3 (Nice to have)

- [ ] Rate limiting
- [ ] Google OAuth
- [ ] Two-factor authentication (2FA)
- [ ] Audit logging

## Security Considerations

1. **Password Storage**: Gunakan bcrypt dengan salt untuk hash password
2. **JWT Secrets**: Simpan di environment variables
3. **HTTPS Only**: Ensure all auth requests menggunakan HTTPS
4. **CORS**: Configure CORS appropriately
5. **Input Validation**: Validate dan sanitize semua inputs
6. **Rate Limiting**: Implement rate limiting untuk login/signup
7. **Secure Cookies**: Jika menggunakan cookies, set HTTP-only dan Secure flags

## Testing

### Manual Testing

1. Login page: `/auth/login`
2. Sign up page: `/auth/signup`
3. Forgot password: `/auth/forgot-password`

### API Testing (dengan curl)

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Sign Up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"test@example.com","password":"password123"}'

# Forgot Password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Environment Variables

Tambahkan ke `.env.local`:

```
# JWT
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key

# Email Service
NEXT_PUBLIC_EMAIL_SERVICE=gmail|sendgrid|etc
NEXT_PUBLIC_EMAIL_FROM=noreply@moxlite.com

# OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
