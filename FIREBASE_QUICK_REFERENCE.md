# Firebase Auth + Realtime Database - Quick Reference

## 📋 Setup Checklist

- [ ] Add `NEXT_PUBLIC_FIREBASE_DATABASE_URL` to `.env.local`
- [ ] Update Firebase Security Rules (see FIREBASE_SETUP.md)
- [ ] Test login functionality
- [ ] Test activity tracking (check Firebase console)
- [ ] Set up admin dashboard

## 🔐 Firebase Auth Usage

### Check if User is Logged In

```typescript
import { useAuth } from "@/lib/authContext";

export function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome {user?.email}</div>;
}
```

### Logout User

```typescript
import { useAuth } from "@/lib/authContext";

export function LogoutButton() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

### Get User ID

```typescript
const { user } = useAuth();
const userId = user?.uid; // Firebase Auth UID
const email = user?.email;
```

## 📊 Activity Tracking Usage

### Track Page Visit

```typescript
import { useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { activityTracker } from "@/lib/activityTracker";

export function MyPage() {
  const { user } = useAuth();

  useEffect(() => {
    activityTracker.trackPageAccess(user, "/my-page", {
      section: "content",
    });
  }, [user]);

  return <div>Page content</div>;
}
```

### Track File Download

```typescript
async function handleDownload() {
  const { user } = useAuth();

  activityTracker.trackDownload(user, "document.pdf", "technical_document");

  // Then download the file
}
```

### Track Custom Action

```typescript
activityTracker.trackActivity(user, "custom_action", {
  details: "something happened",
  value: 123,
});
```

## 📈 View Activity History

### Get User Activities (Last 50)

```typescript
import { ActivityHistoryService } from "@/lib/activityHistoryService";

const activities = await ActivityHistoryService.getUserActivities(userId, 50);
```

### Get Activities by Action Type

```typescript
const logins = await ActivityHistoryService.getActivitiesByAction("login");
const downloads =
  await ActivityHistoryService.getActivitiesByAction("download");
```

### Real-time Activity Updates

```typescript
useEffect(() => {
  if (!user?.uid) return;

  // Subscribe to changes
  const unsubscribe = ActivityHistoryService.onUserActivitiesChange(
    user.uid,
    (activities) => {
      console.log("Activities updated:", activities);
      setActivities(activities);
    },
  );

  // Cleanup
  return unsubscribe;
}, [user?.uid]);
```

### Get User Statistics

```typescript
const stats = await ActivityHistoryService.getUserActivityStats(userId);
console.log(stats.totalActivities); // Total number of activities
console.log(stats.actionCounts); // Count by action type
console.log(stats.firstActivity); // First recorded activity
console.log(stats.lastActivity); // Most recent activity
```

### Get Activity Range

```typescript
const startDate = new Date("2024-01-01");
const endDate = new Date("2024-01-31");

const activities = await ActivityHistoryService.getUserActivitiesByDateRange(
  userId,
  startDate,
  endDate,
  100,
);
```

### Get Daily Analytics

```typescript
const dateStr = "2024-01-15";
const dailyActivities =
  await ActivityHistoryService.getActivitiesByDate(dateStr);
```

## 🎯 Common Patterns

### Track Login Event

Already done automatically when user signs in via `LoginForm.tsx`:

```typescript
// This happens automatically in authContext.ts
await activityTracker.trackLogin(user);
```

### Track Logout Event

Already done automatically via `logout()`:

```typescript
const { logout } = useAuth();
// This calls: activityTracker.trackLogout(user)
```

### Admin Activity Dashboard

```typescript
import { useEffect, useState } from "react";
import { ActivityHistoryService } from "@/lib/activityHistoryService";

export function ActivityDashboard() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Get all activities (admin only)
    const unsubscribe = ActivityHistoryService.onAllActivitiesChange(setActivities);
    return unsubscribe;
  }, []);

  return (
    <div>
      <h2>All User Activities</h2>
      {activities.map((activity) => (
        <div key={activity.id}>
          <p><strong>{activity.action}</strong></p>
          <p>User: {activity.userEmail}</p>
          <p>Time: {ActivityHistoryService.formatActivityDate(activity.timestamp)}</p>
          <p>Details: {JSON.stringify(activity.actionDetails)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Activity Summary Report

```typescript
async function generateReport() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();

  const summary = await ActivityHistoryService.getActivitySummary(
    startDate,
    endDate,
  );

  console.log(`Total Activities: ${summary.totalActivities}`);
  console.log(`Unique Users: ${summary.uniqueUsers.size}`);
  console.log(`Actions:`, summary.actionSummary);
}
```

## 🔧 Troubleshooting

### Activities not showing up

```typescript
// 1. Check if user is authenticated
const { user, isAuthenticated } = useAuth();
console.log("User:", user, "Authenticated:", isAuthenticated);

// 2. Check if database URL is set
console.log("Database URL:", process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);

// 3. Check browser console for errors
```

### Real-time listener not working

```typescript
// Make sure to:
// 1. Check user.uid is available
// 2. Return unsubscribe function in useEffect cleanup
// 3. Depend on user?.uid in useEffect deps

useEffect(() => {
  if (!user?.uid) {
    console.log("No user ID");
    return;
  }

  const unsubscribe = ActivityHistoryService.onUserActivitiesChange(
    user.uid,
    callback,
  );

  return unsubscribe; // IMPORTANT: Return unsubscribe
}, [user?.uid]); // IMPORTANT: Depend on user.uid
```

## 📁 File Reference

| File                                | Purpose                               |
| ----------------------------------- | ------------------------------------- |
| `src/lib/firebase.ts`               | Firebase initialization (Auth + RTDB) |
| `src/lib/authContext.ts`            | Auth state management                 |
| `src/lib/activityTracker.ts`        | Activity tracking to RTDB             |
| `src/lib/activityHistoryService.ts` | Query activity history                |
| `FIREBASE_SETUP.md`                 | Complete configuration guide          |
| `FIREBASE_AUTH_RTDB_MIGRATION.md`   | Migration details                     |

## 🚀 Deployment

### Before deploying:

1. ✅ Set environment variables in production
2. ✅ Update Firebase Security Rules
3. ✅ Test activity tracking
4. ✅ Set up backups

### Environment variables needed:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_DATABASE_URL=xxx
```

## 📞 Support

For detailed information, see:

- `FIREBASE_SETUP.md` - Complete setup guide
- `FIREBASE_AUTH_RTDB_MIGRATION.md` - Migration details
- Source files with inline comments
