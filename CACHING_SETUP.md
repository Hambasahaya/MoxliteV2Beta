# Image Caching Configuration Guide

This document explains how to configure "expires" headers and cache control for images and static assets across different server environments.

## Overview

Proper caching headers allow browsers to cache images locally, reducing server requests and improving page load times. The configurations provided support:

- **Images (JPG, PNG, GIF, WebP, AVIF, SVG)**: Cached for 1 year
- **Fonts (WOFF, TTF, etc.)**: Cached for 1 year
- **CSS/JavaScript**: Cached for 30 days
- **Video files (MP4, M3U8, TS segments)**: Cached for 30 days
- **HTML files**: Not cached (always fetched fresh)

## Implementation Methods

### Option 1: Vercel (Recommended for Next.js)

Your application uses Next.js and has `vercel.json` configured. Caching is automatically handled via:

**File**: `vercel.json`

- Automatically applies cache headers when deployed to Vercel
- No additional setup required
- Headers are applied at CDN edge nodes

**Deploy**: Simply push your changes to your connected git repository

### Option 2: Next.js (Self-hosted)

Your Next.js configuration has been updated in `next.config.ts`:

**File**: `next.config.ts`

- Sets cache headers for all static assets
- Works on any Node.js server that respects Next.js headers
- Includes routes for `/image/*`, `/icon/*`, `/model/*`, `/video/*`

**Implementation**:

```bash
npm run build
npm run start
```

### Option 3: Apache Server

If hosting on Apache, use the `.htaccess` file:

**File**: `public/.htaccess`

- Place in your web root directory (public folder)
- Apache will automatically apply these cache rules
- Requires `mod_expires` and `mod_headers` Apache modules

**Requirements**:

```
sudo a2enmod expires
sudo a2enmod headers
sudo systemctl restart apache2
```

**Configuration in `public/.htaccess`**:

- Images cache for 1 year
- Fonts cache for 1 year
- CSS/JS cache for 30 days
- Videos cache for 30 days
- HTML never cached

### Option 4: NGINX Server

If hosting on NGINX, use the configuration provided:

**File**: `nginx.conf`

- Add the location blocks to your NGINX server configuration
- Can be included in your main `nginx.conf` or a separate file

**Implementation**:

1. Add the cache configuration blocks to your NGINX server block
2. Or include the file: `include /path/to/nginx.conf;`
3. Test configuration: `sudo nginx -t`
4. Reload: `sudo systemctl reload nginx`

**Example server block**:

```nginx
server {
    listen 80;
    server_name moxlite.com;

    # Include cache configuration
    include /path/to/moxlite-web/nginx.conf;

    location / {
        proxy_pass http://your_nodejs_server:3000;
    }
}
```

### Option 5: AWS CloudFront (If using AWS)

For AWS deployments, use CloudFront caching policies:

1. Go to CloudFront distribution settings
2. Create cache policies:
   - **Images**: TTL 31536000 (1 year)
   - **Static Assets**: TTL 2592000 (30 days)
   - **HTML**: TTL 0 (no cache)
3. Apply to corresponding origins

## Cache Duration Summary

| File Type                          | Duration | Seconds  | Reason              |
| ---------------------------------- | -------- | -------- | ------------------- |
| Images (PNG, JPG, SVG, WebP, AVIF) | 1 year   | 31536000 | Rarely changes      |
| Fonts (WOFF, TTF, OTF)             | 1 year   | 31536000 | Semantic versioning |
| CSS/JavaScript                     | 30 days  | 2592000  | Can be versioned    |
| Video files (MP4, M3U8, TS)        | 30 days  | 2592000  | Large files         |
| HTML                               | Never    | 0        | Must fetch fresh    |
| JSON                               | 1 hour   | 3600     | Dynamic content     |

## Cache Headers Used

```
Cache-Control: public, max-age=31536000, immutable
Expires: [date 1 year from now]
Pragma: public
Vary: Accept-Encoding
```

**Explanation**:

- `public`: Cache can be stored by any cache (CDN, browser, etc.)
- `max-age`: Time in seconds the cache is valid
- `immutable`: The resource never changes, safe to cache indefinitely
- `Expires`: Alternative header for older clients
- `Pragma: public`: Backward compatibility
- `Vary: Accept-Encoding`: Cache different versions for different compressions

## Testing Cache Headers

Verify your caching is working:

### Using curl

```bash
curl -I https://moxlite.com/icon/shopping-bag.svg

# Look for headers:
# Cache-Control: public, max-age=31536000, immutable
# Expires: [future date]
```

### Using Chrome DevTools

1. Open DevTools → Network tab
2. Request an image
3. Check Response Headers for `Cache-Control` and `Expires`

### Using Online Tools

- https://httpstatus.io/ - Check HTTP headers
- https://www.seobility.net/en/caching/#cache-busting - Analyze caching

## Browser Cache Behavior

After headers are set:

1. **First visit**: Browser downloads image, stores with expiration date
2. **Repeat visits within 1 year**:
   - Browser uses cached version (no server request)
   - Shows as "disk cache" or "memory cache" in DevTools
   - Page loads instantly
3. **After 1 year**: Browser fetches fresh version

## Cache Busting (Breaking Cache When needed)

For versioning, rename files with hash:

- `logo.svg` → `logo.a1b2c3d4.svg`
- Browser treats as new file, bypasses cache

Next.js does this automatically with `next/image` component.

## Notes

- **Content Delivery Network (CDN)**: If using CloudFlare or similar CDN, they also respect these headers and cache at edge locations
- **Environment Variables**: For Vercel, ensure `vercel.json` is committed to git
- **Local Development**: Caching headers don't apply in development mode; they're only active in production
- **Testing Production**: Use `npm run build && npm run start` locally to test caching

## Monitoring Impact

After implementing cache headers, check these metrics:

1. **Chrome DevTools** → Network tab → check DiskCache/MemoryCache hits
2. **PageSpeed Insights** → Should show "Cache headers" as passing
3. **Lighthouse** → Page load times should improve
4. **Server logs** → Fewer requests for images = lower bandwidth

---

Your caching configuration supports all three major server types (Vercel, Apache, NGINX) and is optimized for your Next.js application.
