# Gunakan image Node.js sebagai base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Salin file package.json dan yarn.lock / package-lock.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Salin semua file proyek ke dalam container
COPY . .

# Build Next.js
RUN yarn build

# Gunakan base image yang lebih kecil untuk runtime
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Salin hasil build dari tahap sebelumnya
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json ./

# Tentukan variabel lingkungan
ENV NODE_ENV production
ENV PORT 3000

# Expose port yang digunakan
EXPOSE 3000

# Jalankan aplikasi Next.js
CMD ["yarn", "start"]
