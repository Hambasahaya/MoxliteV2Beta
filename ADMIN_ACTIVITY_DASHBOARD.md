# 📊 Admin Activity History Dashboard - Setup Guide

## Overview

A comprehensive admin dashboard for tracking and analyzing all user activities on the Moxlite website. View visitor logs, geographical data, and interactive analytics with beautiful visualizations.

## Access URL

```
http://localhost:3000/admin/activity-history
```

## Features

### 🔐 Authentication

- Simple password-based authentication
- Session storage for logged-in state
- Logout functionality

### 📈 Activity Dashboard

- **Real-time Activity Tracking**: Track all user interactions on the website
- **Time Period Filtering**: View activities from Today, Last Week, Last Month, or All Time
- **User Statistics**:
  - Active Users count
  - Total Activities
  - Page Views
  - Downloads
  - Logins

### 📊 Analytics & Visualizations

1. **Overview Tab**:
   - Top 5 Actions (bar chart)
   - Top 5 Pages (bar chart)
   - Top Countries (bar chart)

2. **Analytics Tab**:
   - 24-hour Activity Distribution (line chart)
   - Activity breakdown by action type
   - Country-based distribution

3. **Activity Log Tab**:
   - Complete activity history with filtering
   - Search by user ID, email, or country
   - Filter by action type
   - Pagination support
   - Detailed information: timestamp, user, location, IP address

## Environment Variables

### Required

```bash
# .env.local
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_firebase_rtdb_url
```

### Optional

- If `NEXT_PUBLIC_ADMIN_PASSWORD` is not set, the default is `admin123` (for development only)

## Installation & Setup

### 1. Verify Dependencies

The dashboard uses Firebase Realtime Database which should already be configured. Check:

- `src/lib/firebase.ts` - Firebase configuration
- `src/lib/activityTracker.ts` - Activity tracking service
- `src/lib/activityHistoryService.ts` - Activity query service

### 2. Update Firebase Security Rules

Your Firebase Realtime Database should have security rules that:

- Allow all users to write to their activities
- Allow admin users to read all activities

Example Rules:

```json
{
  "rules": {
    "user_activities": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": true
    },
    "users": {
      "$uid": {
        "activities": {
          ".write": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()",
          ".read": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()"
        }
      }
    },
    "activities_by_date": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": true
    }
  }
}
```

### 3. Set Environment Variables

```bash
# In your .env.local
NEXT_PUBLIC_ADMIN_PASSWORD=YourSecureAdminPassword123
```

### 4. Test the Dashboard

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/activity-history`
3. Enter your admin password
4. View the activity dashboard

## Data Displayed

### Activity Object Structure

```typescript
interface ActivityHistory {
  id: string;
  userId: string; // User identifier
  userEmail?: string; // User email if available
  action: string; // Action type (page_access, download, login, etc.)
  actionDetails: {
    page?: string;
    fileName?: string;
    documentType?: string;
    productName?: string;
    productCategory?: string;
    productFamily?: string;
    [key: string]: unknown;
  };
  timestamp: number; // Unix timestamp in milliseconds
  userAgent?: string; // Browser user agent
  ipAddress?: string; // User IP address
  country?: string; // Country name
  region?: string; // State/Region
  city?: string; // City name
  latitude?: number; // Geolocation latitude
  longitude?: number; // Geolocation longitude
  isp?: string; // Internet service provider
  sessionId?: string; // Session identifier
}
```

### Supported Actions

- `page_access` - User accessed a page
- `download` - User downloaded a file
- `login` - User logged in
- `logout` - User logged out
- `form_submission` - Form submitted
- `search` - Search performed
- `product_view` - Product viewed
- Custom actions as needed

## Features Breakdown

### 1. Time Period Filtering

- **Today**: Shows activities from the last 24 hours
- **Week**: Shows activities from the last 7 days
- **Month**: Shows activities from the last 30 days
- **All**: Shows all available activities (up to 5000 most recent)

### 2. Search & Filter

- **Search**: By User ID, Email, or Country
- **Action Filter**: Filter activities by specific action type
- **Pagination**: 50 items per page

### 3. Statistics Cards

Shows key metrics:

- 👥 Active Users
- 📈 Total Activities
- 👁️ Page Views
- 💾 Downloads
- 🔐 Logins

### 4. Visual Charts

All charts update dynamically based on selected filters:

- Bar charts show percentages and counts
- Line charts show hourly distribution
- Colors are gradient (purple to pink)
- Responsive design for mobile viewing

## Performance Considerations

### Data Limits

- Default query limit: 5,000 activities
- Display limit per page: 50 activities
- Adjustable via parameters

### Optimization Tips

1. Use time period filters for faster loading
2. Search/filter before pagination for better performance
3. Close the dashboard when not in use to prevent connection overhead

## Customization

### Change Admin Password

1. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_ADMIN_PASSWORD=NewSecurePassword
   ```
2. Restart the development server

### Add Custom Metrics

Edit `src/components/admin/ActivityHistoryDashboard.tsx`:

1. Add new stat cards in the `statsGrid`
2. Update `calculateStats()` function
3. Create new chart components as needed

### Modify Styling

Edit `src/components/admin/AdminPanel.module.css`:

- Dashboard container styles
- Chart styles
- Color scheme (currently purple gradient)
- Responsive breakpoints

## Security Best Practices

### 🔐 Production Deployment

1. **Use Strong Passwords**:
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and special characters

2. **Environment Variables**:
   - Never commit `.env.local` to version control
   - Use production environment variables in deployment

3. **Firebase Security Rules**:
   - Restrict read access to authenticated admins only
   - Implement role-based access control

4. **Additional Security**:
   - Consider implementing API key authentication
   - Add rate limiting
   - Log all admin access
   - Use HTTPS only

## Troubleshooting

### Issue: "Failed to load activities"

**Solution**:

- Check Firebase configuration in `src/lib/firebase.ts`
- Verify `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is set
- Check Firebase security rules

### Issue: Login Always Fails

**Solution**:

- Verify `NEXT_PUBLIC_ADMIN_PASSWORD` matches your password
- Check browser console for errors
- Clear session storage: Press F12 → Application → Session Storage → Clear All

### Issue: No Data Showing

**Solution**:

- Ensure activity tracking is enabled in your app
- Check that activities are being written to Firebase
- Use Firebase Console to verify data exists
- Wait for data accumulation (new activities being tracked)

### Issue: Charts Not Displaying

**Solution**:

- Check browser console for JavaScript errors
- Ensure CSS is properly loaded
- Verify `AdminPanel.module.css` has new styles
- Try a different browser

## Future Enhancements

Potential features to add:

- [ ] Real-time activity updates with WebSocket
- [ ] Export data to CSV/PDF
- [ ] Advanced filtering options
- [ ] User behavior heatmaps
- [ ] Custom date range picker
- [ ] User retention analytics
- [ ] Conversion funnel analysis
- [ ] Activity notifications/alerts

## Links & References

### Related Files

- Dashboard Component: `src/components/admin/ActivityHistoryDashboard.tsx`
- Admin Page: `src/pages/admin/activity-history.tsx`
- Styles: `src/components/admin/AdminPanel.module.css`
- Activity Tracker: `src/lib/activityTracker.ts`
- Activity Service: `src/lib/activityHistoryService.ts`
- Firebase Config: `src/lib/firebase.ts`

### Firebase Documentation

- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)

### Dashboard Technologies

- **React**: UI framework
- **Next.js**: Server-side rendering
- **Firebase RTDB**: Data storage
- **CSS Modules**: Styling

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the Firebase console for data issues
3. Check browser console for error messages
4. Verify all environment variables are set correctly

---

**Last Updated**: April 2026
**Version**: 1.0.0
