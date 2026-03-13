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

# Build arguments dengan default values
ARG NEXT_PUBLIC_FE_BASE_URL=https://moxlite.com
ARG NEXT_PUBLIC_GA_ID=G-4L66RV0D2F
ARG NEXT_PUBLIC_RECAPTCHA_KEY=6LczF_MqAAAAAB92sOvF0LRHCTt2JdJ4xJ6VFl5b
ARG NEXT_PUBLIC_API_BASE_URL=https://backstage.moxlite.com

# Set environment variables untuk build process
ENV NEXT_PUBLIC_FE_BASE_URL=$NEXT_PUBLIC_FE_BASE_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_RECAPTCHA_KEY=$NEXT_PUBLIC_RECAPTCHA_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NODE_ENV=production

# Debug: Verify environment variables are set
RUN echo "Building with API_BASE_URL: $NEXT_PUBLIC_API_BASE_URL" && \
    echo "Building with FE_BASE_URL: $NEXT_PUBLIC_FE_BASE_URL"

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
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--no-warnings"

# Expose port yang digunakan
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Jalankan aplikasi Next.js
CMD ["yarn", "start"]
