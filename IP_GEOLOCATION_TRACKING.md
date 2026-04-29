# IP Address & Geolocation Tracking

## Overview

Activity tracking sekarang mencakup informasi IP address dan geolocation user (negara, region/daerah, kota, koordinat lat/lon).

## Fitur

### 1. **IP Address Detection**

- Detect IP dari berbagai header (proxy-aware)
- Support `X-Forwarded-For`, `X-Real-IP`, dan socket address
- Fallback jika tidak ada IP

### 2. **Geolocation Data**

- Negara (country)
- Region/Daerah (region)
- Kota (city)
- Koordinat: Latitude & Longitude
- ISP Information
- Timezone

### 3. **Caching**

- IP location data di-cache selama 5 menit
- Mengurangi API calls ke geolocation service
- Better performance

## Data Stored

### Firebase Realtime Database Structure

```json
{
  "user_activities": {
    "activity_id": {
      "userId": "user123 atau anon_hash",
      "userEmail": "user@email.com",  // Hanya jika authenticated
      "action": "page_access",

      // IP & Location Data
      "ipAddress": "123.45.67.89",
      "country": "ID",                // Country code
      "region": "Jakarta",            // Region/State
      "city": "Jakarta Selatan",
      "latitude": -6.2746,
      "longitude": 106.7742,
      "isp": "PT Telkomsel Indonesia",

      // Other activity data
      "timestamp": 1714391234567,
      "sessionId": "session_...",
      "userAgent": "Mozilla/5.0...",
      "actionDetails": {...}
    }
  }
}
```

## API Endpoint

### GET `/api/tracking/get-ip-location`

Returns IP address and geolocation information for client.

**Response:**

```json
{
  "ip": "123.45.67.89",
  "country": "ID",
  "region": "Jakarta",
  "city": "Jakarta Selatan",
  "latitude": -6.2746,
  "longitude": 106.7742,
  "timezone": "Asia/Jakarta",
  "isp": "PT Telkomsel Indonesia"
}
```

## Geolocation Services

API endpoint tries multiple services in order:

1. **ipinfo.io** (primary)
   - Free tier: 50,000 requests/month
   - Optional token: `IPINFO_TOKEN` env variable
   - Most accurate

2. **ip-api.com** (fallback)
   - Free tier: 45 requests/minute
   - Automatic fallback if ipinfo fails
   - Good accuracy

3. **Fallback to IP only**
   - If both services fail, only IP is recorded
   - No activity tracking disruption

## Environment Variables

Optional IP location config:

```env
# Optional: ipinfo.io API token for better accuracy
IPINFO_TOKEN=your_ipinfo_token_here
```

Get free token from: https://ipinfo.io/

## Usage Examples

### How Data Appears

**When user is NOT logged in:**

```json
{
  "userId": "anon_a1b2c3d4", // Anonymous ID
  "action": "page_access",
  "ipAddress": "192.168.1.1",
  "country": "ID",
  "region": "Jakarta",
  "city": "Jakarta Pusat"
}
```

**When user IS logged in:**

```json
{
  "userId": "firebase_uid_xyz",
  "userEmail": "user@email.com",
  "action": "page_access",
  "ipAddress": "203.160.x.x",
  "country": "ID",
  "region": "Jawa Barat",
  "city": "Bandung"
}
```

### Query Activities by Location

```typescript
import { ActivityHistoryService } from "@/lib/activityHistoryService";

// Get all activities
const activities = await ActivityHistoryService.getAllActivities(100);

// Filter by country
const indonesianActivities = activities.filter((a) => a.country === "ID");

// Filter by region
const jakartaActivities = activities.filter((a) => a.region === "Jakarta");

// Filter by city
const bandungActivities = activities.filter((a) => a.city === "Bandung");
```

### Visualize on Map

```typescript
// Get user activities with coordinates
const activities = await ActivityHistoryService.getUserActivities(userId);

// Use coordinates for map visualization
const locations = activities
  .filter((a) => a.latitude && a.longitude)
  .map((a) => ({
    lat: a.latitude,
    lng: a.longitude,
    city: a.city,
    timestamp: a.timestamp,
  }));
```

## Performance Considerations

- **Caching**: IP location cached for 5 minutes per session
- **Async Operation**: IP location fetch doesn't block activity tracking
- **Fallback**: Works even if geolocation services are down
- **Database**: Optimized for queries by country/region

## Privacy & Security

### Data Collection

- IP address collected for analytics and security
- Geolocation data is approximate (not precise)
- Data anonymized for non-authenticated users

### Compliance

- Consider GDPR, CCPA, and local regulations
- May require user consent for IP tracking
- Implement data retention policies

### Recommendations

1. Add privacy policy disclosure about IP tracking
2. Implement data deletion after retention period
3. Secure Firebase database rules
4. Use HTTPS only for all connections

## Security Rules (Firebase)

```json
{
  "rules": {
    "user_activities": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": false
    }
  }
}
```

Ensure only admins can read activity data including IP/location.

## Troubleshooting

### IP shows as "192.168.x.x" or "127.0.0.1"

- **Cause**: Running on localhost
- **Solution**: Normal in development; check with public deployment

### Geolocation not appearing

- **Cause**: IP location service failed
- **Solution**: Check Firebase logs; IP will still be recorded

### All activities showing same location

- **Cause**: Caching (5 minute cache)
- **Solution**: Expected behavior; wait or clear cache

### High API costs

- **Cause**: Too many geolocation requests
- **Solution**: Cache is already configured; reduce activity tracking or use IPINFO_TOKEN

## Files Modified/Created

1. **Created**: `src/pages/api/tracking/get-ip-location.ts`
   - New API endpoint for IP/location detection

2. **Modified**: `src/lib/activityTracker.ts`
   - Added geolocation fields to interface
   - Added `getIPLocation()` method
   - Updated `trackActivity()` to include IP/location
   - Added caching mechanism

## Next Steps

1. ✅ Test IP detection on local network
2. ✅ Deploy and test with real IP addresses
3. ✅ Set up geolocation analytics dashboard
4. ✅ Create map visualization of user locations
5. ✅ Implement data retention policies
6. ✅ Add privacy disclosures

## References

- ipinfo.io: https://ipinfo.io
- ip-api.com: https://ip-api.com
- Firebase Security Rules: https://firebase.google.com/docs/database/security
