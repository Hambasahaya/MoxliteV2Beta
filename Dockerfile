# Gunakan image Node.js versi 22 sebagai base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Salin file package.json dan yarn.lock
COPY package.json yarn.lock ./

# Install dependencies dengan suppress warning
RUN yarn install --frozen-lockfile --no-progress --silent

# Salin semua file proyek ke dalam container
COPY . .

ARG NEXT_PUBLIC_FE_BASE_URL=""
ENV NEXT_PUBLIC_FE_BASE_URL=$NEXT_PUBLIC_FE_BASE_URL

# Build Next.js tanpa warning
RUN NODE_OPTIONS="--no-warnings" yarn build

# Gunakan base image yang lebih kecil untuk runtime
FROM node:22-alpine AS runner

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
ENV NODE_OPTIONS "--no-warnings"

# Expose port yang digunakan
EXPOSE 3000

# Jalankan aplikasi Next.js
CMD ["yarn", "start"]
