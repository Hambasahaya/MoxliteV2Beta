import { User } from "firebase/auth";
import { ref, push, set } from "firebase/database";
import { rtdb } from "./firebase";

export interface UserActivity {
  id?: string;
  userId: string;
  userEmail?: string;
  action: string; // "page_access", "download", "login", "logout", etc.
  actionDetails: {
    page?: string;
    fileName?: string;
    documentType?: string;
    productName?: string;
    productCategory?: string;
    productFamily?: string;
    [key: string]: unknown;
  };
  timestamp: number; // Unix timestamp
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  sessionId?: string;
}

/**
 * Activity Tracking Service
 * Logs all user activities to Firebase Realtime Database
 */
export class ActivityTracker {
  private sessionId: string;
  private ipLocationCache: any = null;
  private ipLocationCacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.sessionId = this.getExistingSessionId() || this.generateSessionId();
    this.persistSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private getExistingSessionId(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return window.sessionStorage.getItem("moxlite_session_id");
  }

  private persistSessionId(): void {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem("moxlite_session_id", this.sessionId);
  }

  /**
   * Generate anonymous user ID based on session and user agent
   */
  private generateAnonymousId(): string {
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
    const hash = this.simpleHash(userAgent + this.sessionId);
    return `anon_${hash}`;
  }

  /**
   * Simple hash function for generating anonymous IDs
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get IP address and geolocation information
   */
  private async getIPLocation(): Promise<{
    ip?: string;
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    isp?: string;
  }> {
    try {
      // Return cached data if still valid
      const now = Date.now();
      if (this.ipLocationCache && now - this.ipLocationCacheTime < this.CACHE_DURATION) {
        return this.ipLocationCache;
      }

      // Fetch IP and location from API
      const response = await fetch("/api/tracking/get-ip-location", {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        this.ipLocationCache = data;
        this.ipLocationCacheTime = now;
        return data;
      }
    } catch (error) {
      console.error("Error fetching IP location:", error);
    }

    return {};
  }

  /**
   * Remove undefined values from object (Firebase doesn't allow undefined)
   */
  private cleanObject(obj: any): any {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.cleanObject(item)).filter((item) => item !== undefined);
    }

    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value !== undefined) {
          cleaned[key] = this.cleanObject(value);
        }
      }
    }
    return cleaned;
  }

  /**
   * Track user activity to Firebase Realtime Database
   */
  async trackActivity(
    user: User | null,
    action: string,
    actionDetails: UserActivity["actionDetails"] = {}
  ): Promise<void> {
    try {
      const isAuthenticated = !!user?.uid;
      const userId = isAuthenticated ? user.uid : this.generateAnonymousId();

      // Get IP and location information
      const ipLocation = await this.getIPLocation();

      // Build activity object - only include defined values
      const activity: any = {
        userId,
        action,
        actionDetails: {
          ...actionDetails,
        },
        timestamp: Date.now(),
        sessionId: this.sessionId,
      };

      // Add IP and location information
      if (ipLocation.ip) {
        activity.ipAddress = ipLocation.ip;
      }
      if (ipLocation.country) {
        activity.country = ipLocation.country;
      }
      if (ipLocation.region) {
        activity.region = ipLocation.region;
      }
      if (ipLocation.city) {
        activity.city = ipLocation.city;
      }
      if (ipLocation.latitude !== undefined) {
        activity.latitude = ipLocation.latitude;
      }
      if (ipLocation.longitude !== undefined) {
        activity.longitude = ipLocation.longitude;
      }
      if (ipLocation.isp) {
        activity.isp = ipLocation.isp;
      }

      // Add optional fields only if they have values
      if (isAuthenticated && user?.email) {
        activity.userEmail = user.email;
      }

      if (typeof window !== "undefined") {
        activity.actionDetails.currentPath = window.location.pathname;
        activity.actionDetails.currentUrl = window.location.href;
        activity.actionDetails.viewport = `${window.innerWidth}x${window.innerHeight}`;
      }

      if (typeof navigator !== "undefined") {
        activity.userAgent = navigator.userAgent;
        activity.actionDetails.language = navigator.language;
      }

      if (typeof Intl !== "undefined") {
        activity.actionDetails.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }

      // Clean object to remove any undefined values
      const cleanedActivity = this.cleanObject(activity);

      // Save to Firebase Realtime Database - Global activity log
      const activitiesRef = ref(rtdb, "user_activities");
      const newActivityRef = push(activitiesRef);
      await set(newActivityRef, cleanedActivity);

      // Also save to user-specific activity log for faster queries
      const userActivitiesRef = ref(rtdb, `users/${userId}/activities`);
      const userActivityRef = push(userActivitiesRef);
      await set(userActivityRef, cleanedActivity);

      // Save to daily activity log for analytics
      const dateKey = new Date().toISOString().split("T")[0];
      const dailyRef = ref(rtdb, `activities_by_date/${dateKey}`);
      const dailyActivityRef = push(dailyRef);
      await set(dailyActivityRef, cleanedActivity);
    } catch (error) {
      console.error("Failed to track activity:", error);
      // Silently fail - don't interrupt user experience
    }
  }

  /**
   * Track page access
   */
  async trackPageAccess(
    user: User | null,
    page: string,
    additionalDetails: UserActivity["actionDetails"] = {}
  ): Promise<void> {
    await this.trackActivity(user, "page_access", {
      page,
      ...additionalDetails,
    });
  }

  /**
   * Track file download
   */
  async trackDownload(
    user: User | null,
    fileName: string,
    documentType: string,
    additionalDetails: UserActivity["actionDetails"] = {}
  ): Promise<void> {
    await this.trackActivity(user, "download", {
      fileName,
      documentType,
      ...additionalDetails,
    });
  }

  /**
   * Track blocked download attempts
   */
  async trackDownloadBlocked(
    user: User | null,
    fileName: string,
    documentType: string,
    additionalDetails: UserActivity["actionDetails"] = {}
  ): Promise<void> {
    await this.trackActivity(user, "download_blocked", {
      fileName,
      documentType,
      reason: "login_required",
      ...additionalDetails,
    });
  }

  /**
   * Track login event
   */
  async trackLogin(user: User): Promise<void> {
    const loginDetails: any = {};
    if (user.email) {
      loginDetails.email = user.email;
    }
    loginDetails.providerId = user.providerData[0]?.providerId || "password";
    
    await this.trackActivity(user, "login", loginDetails);
  }

  /**
   * Track signup event
   */
  async trackSignup(
    user: User,
    additionalDetails: UserActivity["actionDetails"] = {}
  ): Promise<void> {
    const signupDetails: any = {};
    if (user.email) {
      signupDetails.email = user.email;
    }
    signupDetails.providerId = user.providerData[0]?.providerId || "password";
    
    await this.trackActivity(user, "signup", {
      ...signupDetails,
      ...additionalDetails,
    });
  }

  /**
   * Track logout event
   */
  async trackLogout(user: User | null): Promise<void> {
    await this.trackActivity(user, "logout", {});
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
export const activityTracker = new ActivityTracker();
