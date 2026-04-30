import {
  ref,
  query,
  limitToLast,
  get,
  onValue,
  Unsubscribe,
} from "firebase/database";
import { rtdb } from "./firebase";
import type { UserActivity } from "./activityTracker";

export interface ActivityHistory extends UserActivity {
  id: string;
}

/**
 * Activity History Service
 * Retrieves and queries user activity history from Firebase Realtime Database
 */
export class ActivityHistoryService {
  /**
   * Get recent activities for a specific user
   */
  static async getUserActivities(
    userId: string,
    limit: number = 100
  ): Promise<ActivityHistory[]> {
    try {
      const userActivitiesRef = ref(rtdb, `users/${userId}/activities`);
      const userQuery = query(userActivitiesRef, limitToLast(limit));
      const snapshot = await get(userQuery);

      if (!snapshot.exists()) {
        return [];
      }

      const activities: ActivityHistory[] = [];
      snapshot.forEach((childSnapshot) => {
        activities.push({
          id: childSnapshot.key || "",
          ...(childSnapshot.val() as UserActivity),
        });
      });

      // Sort by timestamp descending (most recent first)
      return activities.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      return [];
    }
  }

  /**
   * Get activities for a specific date
   */
  static async getActivitiesByDate(date: string): Promise<ActivityHistory[]> {
    try {
      const dailyRef = ref(rtdb, `activities_by_date/${date}`);
      const snapshot = await get(dailyRef);

      if (!snapshot.exists()) {
        return [];
      }

      const activities: ActivityHistory[] = [];
      snapshot.forEach((childSnapshot) => {
        activities.push({
          id: childSnapshot.key || "",
          ...(childSnapshot.val() as UserActivity),
        });
      });

      // Sort by timestamp descending
      return activities.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error fetching daily activities:", error);
      return [];
    }
  }

  /**
   * Get all activities (admin only)
   */
  static async getAllActivities(limit: number = 1000): Promise<ActivityHistory[]> {
    try {
      const activitiesRef = ref(rtdb, "user_activities");
      const allActivitiesQuery = query(activitiesRef, limitToLast(limit));
      const snapshot = await get(allActivitiesQuery);

      if (!snapshot.exists()) {
        return [];
      }

      const activities: ActivityHistory[] = [];
      snapshot.forEach((childSnapshot) => {
        activities.push({
          id: childSnapshot.key || "",
          ...(childSnapshot.val() as UserActivity),
        });
      });

      // Sort by timestamp descending
      return activities.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error fetching all activities:", error);
      return [];
    }
  }

  /**
   * Get activities by action type
   */
  static async getActivitiesByAction(
    action: string,
    limit: number = 100
  ): Promise<ActivityHistory[]> {
    try {
      const activitiesRef = ref(rtdb, "user_activities");
      const snapshot = await get(activitiesRef);

      if (!snapshot.exists()) {
        return [];
      }

      const activities: ActivityHistory[] = [];
      snapshot.forEach((childSnapshot) => {
        const activity = childSnapshot.val() as UserActivity;
        if (activity.action === action) {
          activities.push({
            id: childSnapshot.key || "",
            ...activity,
          });
        }
      });

      // Sort by timestamp descending and limit
      return activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching activities by action:", error);
      return [];
    }
  }

  /**
   * Get user activities filtered by date range
   */
  static async getUserActivitiesByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 1000
  ): Promise<ActivityHistory[]> {
    try {
      const userActivitiesRef = ref(rtdb, `users/${userId}/activities`);
      const snapshot = await get(userActivitiesRef);

      if (!snapshot.exists()) {
        return [];
      }

      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      const activities: ActivityHistory[] = [];

      snapshot.forEach((childSnapshot) => {
        const activity = childSnapshot.val() as UserActivity;
        if (activity.timestamp >= startTime && activity.timestamp <= endTime) {
          activities.push({
            id: childSnapshot.key || "",
            ...activity,
          });
        }
      });

      // Sort by timestamp descending and limit
      return activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching user activities by date range:", error);
      return [];
    }
  }

  /**
   * Get activity statistics for a user
   */
  static async getUserActivityStats(userId: string): Promise<{
    totalActivities: number;
    actionCounts: Record<string, number>;
    lastActivity: ActivityHistory | null;
    firstActivity: ActivityHistory | null;
  }> {
    try {
      const userActivitiesRef = ref(rtdb, `users/${userId}/activities`);
      const snapshot = await get(userActivitiesRef);

      if (!snapshot.exists()) {
        return {
          totalActivities: 0,
          actionCounts: {},
          lastActivity: null,
          firstActivity: null,
        };
      }

      const activities: ActivityHistory[] = [];
      const actionCounts: Record<string, number> = {};

      snapshot.forEach((childSnapshot) => {
        const activity = childSnapshot.val() as UserActivity;
        activities.push({
          id: childSnapshot.key || "",
          ...activity,
        });
        actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
      });

      activities.sort((a, b) => a.timestamp - b.timestamp);

      return {
        totalActivities: activities.length,
        actionCounts,
        lastActivity:
          activities.length > 0
            ? activities[activities.length - 1]
            : null,
        firstActivity: activities.length > 0 ? activities[0] : null,
      };
    } catch (error) {
      console.error("Error fetching user activity stats:", error);
      return {
        totalActivities: 0,
        actionCounts: {},
        lastActivity: null,
        firstActivity: null,
      };
    }
  }

  /**
   * Listen to real-time user activities
   */
  static onUserActivitiesChange(
    userId: string,
    callback: (activities: ActivityHistory[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const userActivitiesRef = ref(rtdb, `users/${userId}/activities`);

    const unsubscribe = onValue(
      userActivitiesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback([]);
          return;
        }

        const activities: ActivityHistory[] = [];
        snapshot.forEach((childSnapshot) => {
          activities.push({
            id: childSnapshot.key || "",
            ...(childSnapshot.val() as UserActivity),
          });
        });

        // Sort by timestamp descending
        activities.sort((a, b) => b.timestamp - a.timestamp);
        callback(activities);
      },
      (error) => {
        console.error("Error listening to user activities:", error);
        onError?.(error);
      }
    );

    return unsubscribe;
  }

  /**
   * Listen to real-time all activities (admin only)
   */
  static onAllActivitiesChange(
    callback: (activities: ActivityHistory[]) => void,
    onError?: (error: Error) => void,
    limit: number = 1000
  ): Unsubscribe {
    const activitiesRef = ref(rtdb, "user_activities");
    const activitiesQuery = query(activitiesRef, limitToLast(limit));

    const unsubscribe = onValue(
      activitiesQuery,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback([]);
          return;
        }

        const activities: ActivityHistory[] = [];
        snapshot.forEach((childSnapshot) => {
          activities.push({
            id: childSnapshot.key || "",
            ...(childSnapshot.val() as UserActivity),
          });
        });

        // Sort by timestamp descending
        activities.sort((a, b) => b.timestamp - a.timestamp);
        callback(activities);
      },
      (error) => {
        console.error("Error listening to all activities:", error);
        onError?.(error);
      }
    );

    return unsubscribe;
  }

  /**
   * Format timestamp to readable date
   */
  static formatActivityDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  /**
   * Get activity summary by date range
   */
  static async getActivitySummary(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalActivities: number;
    uniqueUsers: Set<string>;
    actionSummary: Record<string, number>;
    dateRange: { start: string; end: string };
  }> {
    try {
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      const allActivities = await this.getAllActivities(10000);

      const filteredActivities = allActivities.filter(
        (activity) =>
          activity.timestamp >= startTime && activity.timestamp <= endTime
      );

      const uniqueUsers = new Set<string>();
      const actionSummary: Record<string, number> = {};

      filteredActivities.forEach((activity) => {
        uniqueUsers.add(activity.userId);
        actionSummary[activity.action] =
          (actionSummary[activity.action] || 0) + 1;
      });

      return {
        totalActivities: filteredActivities.length,
        uniqueUsers,
        actionSummary,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      };
    } catch (error) {
      console.error("Error generating activity summary:", error);
      return {
        totalActivities: 0,
        uniqueUsers: new Set(),
        actionSummary: {},
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      };
    }
  }
}
