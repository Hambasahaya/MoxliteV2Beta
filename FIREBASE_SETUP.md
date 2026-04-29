# Firebase Configuration Guide

## Environment Variables Setup

Add these environment variables to your `.env.local` file:

```env
# Firebase Web SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Realtime Database URL (Required for Activity Tracking)
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com

# Firebase Admin SDK Configuration (for backend only - optional)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","...more_json_fields...}'
```

## How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click on **⚙️ Project Settings** (gear icon)
4. Under **"Your apps"**, find your web app
5. Copy the configuration object and fill in the environment variables above

### Get Realtime Database URL

1. In Firebase Console, go to **Realtime Database**
2. Create a database if you haven't already
3. Copy the database URL (looks like `https://your_project_id.firebaseio.com`)
4. Add it as `NEXT_PUBLIC_FIREBASE_DATABASE_URL` in your `.env.local`

## Firebase Admin SDK Setup (Optional)

1. In Firebase Console, go to **Project Settings → Service Accounts**
2. Click **"Generate New Private Key"**
3. Copy the entire JSON content and paste it as `FIREBASE_SERVICE_ACCOUNT_KEY`

## Features Implemented

### 1. **User Authentication with Firebase Auth**

- Email/Password login
- Google OAuth login
- Automatic session persistence
- Auth state management with React Context
- Uses Firebase Authentication API

### 2. **Activity Tracking with Firebase Realtime Database**

- Page access tracking
- Download tracking
- Blocked download attempt tracking for anonymous users
- Login/Logout tracking
- Signup and password reset request tracking
- Session tracking with unique session IDs
- Real-time activity logging directly to Firebase Realtime Database

#### Activity Storage Structure

Activities are stored in three locations for optimal querying:

```
/user_activities/              # All activities (admin analytics)
  {activityId}/
    userId
    userEmail
    action
    actionDetails
    timestamp
    sessionId
    userAgent

/users/{userId}/activities/    # Per-user activity history
  {activityId}/
    (same structure as above)

/activities_by_date/{YYYY-MM-DD}/  # Daily activity log
  {activityId}/
    (same structure as above)
```

### 3. **Admin Analytics Dashboard**

- View all user activities
- Filter by user, action type, or date range
- Download statistics
- Page access statistics
- User activity reports
- Real-time activity tracking

## Using Activity History Service

### Import the service

```typescript
import { ActivityHistoryService } from "@/lib/activityHistoryService";
```

### Common Usage Examples

```typescript
// Get recent activities for current user
const activities = await ActivityHistoryService.getUserActivities(userId, 50);

// Get activities by date
const dailyActivities =
  await ActivityHistoryService.getActivitiesByDate("2024-01-15");

// Get activities filtered by action type
const logins = await ActivityHistoryService.getActivitiesByAction("login");

// Get user activity statistics
const stats = await ActivityHistoryService.getUserActivityStats(userId);

// Listen to real-time activities
const unsubscribe = ActivityHistoryService.onUserActivitiesChange(
  userId,
  (activities) => {
    console.log("Activities updated:", activities);
  },
);

// Clean up listener
unsubscribe();

// Get activities by date range
const rangeActivities =
  await ActivityHistoryService.getUserActivitiesByDateRange(
    userId,
    new Date("2024-01-01"),
    new Date("2024-01-31"),
  );

// Get activity summary for analytics
const summary = await ActivityHistoryService.getActivitySummary(
  new Date("2024-01-01"),
  new Date("2024-01-31"),
);
```

## Firebase Security Rules

Set up these security rules in your Firebase Console:

**Realtime Database Rules:**

```json
{
  "rules": {
    "user_activities": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": false
    },
    "users": {
      "$uid": {
        "activities": {
          ".read": "auth.uid === $uid || root.child('admins').child(auth.uid).exists()",
          ".write": "auth.uid === $uid",
          "$activityId": {
            ".validate": "newData.hasChildren(['userId', 'action', 'timestamp'])"
          }
        }
      }
    },
    "activities_by_date": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": false
    },
    "admins": {
      ".read": false,
      ".write": false
    }
  }
}
```

**Firestore Rules (if using Firestore alongside RTDB):**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /user_activities/{activity} {
      allow read: if request.auth.uid in resource.data.adminsList;
      allow write: if false;
    }
  }
}
```

## File Structure

```
src/
├── lib/
│   ├── firebase.ts                      # Firebase initialization with RTDB
│   ├── authContext.ts                   # Auth context provider
│   ├── activityTracker.ts               # Activity tracking to Firebase RTDB
│   ├── activityHistoryService.ts        # Query activity history
│   └── protectedRoute.tsx               # Protected route wrapper
├── pages/
│   ├── _app.tsx                         # Updated with AuthProvider
│   ├── api/
│   │   └── tracking/
│   │       └── analytics.ts             # Analytics endpoint (optional)
│   └── auth/
│       └── login                        # Login page
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── LogoutButton.tsx
│   └── admin/
│       └── ChatbotAnalytics.tsx         # Activity analytics dashboard
```

## Migration from API-based Tracking

If you previously used the API-based activity tracking:

1. **Remove old API routes** (optional):
   - `/src/pages/api/tracking/log-activity.ts`
   - `/src/pages/api/tracking/analytics.ts`
   - `/src/lib/server/firebaseAdmin.ts` (if no longer needed)

2. **Update environment variables**: Add `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

3. **Test activity tracking**: Open browser DevTools and check that activities are being saved to Firebase Realtime Database

## Troubleshooting

### Activities not showing up

1. Check Firebase console → Realtime Database to confirm data is being written
2. Verify `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is set correctly
3. Check browser console for errors
4. Ensure Firebase Auth is working (user is authenticated)

### Permission Denied errors

1. Check Firebase Security Rules in console
2. Ensure user is authenticated (check `useAuth()` hook)
3. Verify admin access if viewing all activities

### Real-time updates not working

1. Ensure you're using `onUserActivitiesChange()` or `onAllActivitiesChange()` for real-time listeners
2. Don't forget to unsubscribe from listeners when component unmounts
3. Check network tab in DevTools for active Firebase connections

## Performance Tips

- Use user-specific activity queries (`getUserActivities()`) instead of fetching all activities
- Set appropriate `limit` parameters to avoid loading large datasets
- Use `ActivityHistoryService.onUserActivitiesChange()` for real-time updates instead of polling
- Create indexes in Firebase for frequently filtered queries

## Next Steps

1. Enable other Firebase services if needed (Cloud Storage, Cloud Functions, etc.)
2. Set up Firebase hosting for deployment
3. Configure backup and restore strategies
4. Implement data retention policies

│ │ └── LoginForm.tsx # Updated with Firebase
│ └── product/
│ └── TechDocs/
│ └── index.tsx # Protected downloads

````

## Usage

### In Components

```typescript
import { useAuth } from "@/lib/authContext";
import { activityTracker } from "@/lib/activityTracker";

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  // Track page access
  useEffect(() => {
    activityTracker.trackPageAccess(user, "/my-page");
  }, [user]);

  // Track download
  const handleDownload = async () => {
    await activityTracker.trackDownload(
      user,
      "document.pdf",
      "User Manual"
    );
    // ... download logic
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Welcome {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </>
  );
}
````

### Protected Routes

```typescript
import ProtectedRoute, { useCanDownload } from "@/lib/protectedRoute";

export default function DownloadPage() {
  const canDownload = useCanDownload();

  if (!canDownload) {
    return <p>Loading...</p>;
  }

  return <ProtectedRoute>
    <YourComponent />
  </ProtectedRoute>;
}
```

## API Endpoints

### Log Activity

```
POST /api/tracking/log-activity

Body: {
  userId: string,
  userEmail?: string,
  action: "page_access" | "download" | "login" | "logout",
  actionDetails: {...},
  timestamp: Date,
  sessionId?: string
}
```

### Get Analytics (Requires Admin Token)

```
GET /api/tracking/analytics?action=get-all-activities
Header: x-admin-token: your_admin_token

Actions:
- get-all-activities
- get-downloads
- get-analytics-summary
- get-user-activities
```

## Security Notes

1. **Admin Token**: Change `NEXT_PUBLIC_ADMIN_TOKEN` in your environment
2. **Firebase Rules**: Set up proper Firestore security rules:

   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /user_activities/{document=**} {
         allow create: if request.auth != null;
         allow read: if request.auth.token.admin == true;
       }
       match /activities_by_date/{document=**} {
         allow read: if request.auth.token.admin == true;
       }
     }
   }
   ```

3. **API Protection**: All tracking endpoints should only be called from your frontend

## Next Steps

1. Add Firebase SDK to package.json: ✅ Done
2. Configure Firebase Console credentials
3. Add environment variables to `.env.local`
4. Deploy Firestore security rules
5. Test authentication flow
6. Monitor activity analytics in admin dashboard
