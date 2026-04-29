# Firebase SQL Connect

This folder contains the SQL Connect schema used by the Next.js tracking API.

The current app writes activity logs through the Firebase Admin SDK when these
environment variables are configured:

```env
FIREBASE_SQL_CONNECT_LOCATION=northamerica-northeast2
FIREBASE_SQL_CONNECT_SERVICE_ID=moxlite-2026-service
FIREBASE_SQL_CONNECT_CONNECTOR=default
FIREBASE_SQL_CONNECT_ACTIVITY_TABLE=UserActivity
FIREBASE_SQL_CONNECT_ACTIVITY_QUERY_FIELD=userActivities
```

Deploy `schema/user_activity.gql` to your SQL Connect service from the Firebase
Console, Firebase CLI, or the SQL Connect VS Code extension before setting
`FIREBASE_ACTIVITY_TRACKING_STRICT_SQL=true`.
