/**
 * API Route: Activity Analytics
 * Retrieves user activity analytics from Firebase SQL Connect when configured,
 * with Firestore fallback.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import type { Query } from "firebase-admin/firestore";
import {
  getActivityQueryField,
  getFirebaseAdminDb,
  getFirebaseSqlConnect,
} from "@/lib/server/firebaseAdmin";

type ActivityRecord = {
  id?: string;
  userId: string;
  userEmail?: string | null;
  action: string;
  actionDetails?: Record<string, unknown>;
  page?: string | null;
  fileName?: string | null;
  documentType?: string | null;
  productName?: string | null;
  productCategory?: string | null;
  productFamily?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  sessionId?: string | null;
  timestamp?: unknown;
  createdAt?: string;
};

type ResponseData = {
  success: boolean;
  data?: unknown;
  error?: string;
  total?: number;
};

const isValidGraphqlField = (field: string) =>
  /^[A-Za-z_][A-Za-z0-9_]*$/.test(field);

const toDate = (value: unknown): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getStringValue = (value: unknown) =>
  typeof value === "string" && value.length > 0 ? value : undefined;

const normalizeActivity = (activity: ActivityRecord): ActivityRecord => {
  const timestamp = toDate(activity.timestamp || activity.createdAt);
  const details = activity.actionDetails || {};

  return {
    ...activity,
    actionDetails: {
      ...details,
      page: getStringValue(details.page) || getStringValue(activity.page),
      fileName:
        getStringValue(details.fileName) || getStringValue(activity.fileName),
      documentType:
        getStringValue(details.documentType) ||
        getStringValue(activity.documentType),
      productName:
        getStringValue(details.productName) || getStringValue(activity.productName),
      productCategory:
        getStringValue(details.productCategory) ||
        getStringValue(activity.productCategory),
      productFamily:
        getStringValue(details.productFamily) ||
        getStringValue(activity.productFamily),
    },
    timestamp: timestamp || activity.timestamp || activity.createdAt,
  };
};

const getSqlActivities = async (limit = 1000) => {
  const sqlConnect = getFirebaseSqlConnect();
  const queryField = getActivityQueryField();

  if (!sqlConnect || !isValidGraphqlField(queryField)) {
    return null;
  }

  const query = `
    query ListUserActivities($limit: Int!) {
      ${queryField}(orderBy: [{ createdAt: DESC }], limit: $limit) {
        id
        userId
        userEmail
        action
        actionDetails
        page
        fileName
        documentType
        productName
        productCategory
        productFamily
        userAgent
        ipAddress
        sessionId
        createdAt
      }
    }
  `;

  const response = await sqlConnect.executeGraphqlRead<
    Record<string, ActivityRecord[]>,
    { limit: number }
  >(query, {
    variables: { limit },
  });

  return (response.data[queryField] || []).map(normalizeActivity);
};

const getFirestoreActivities = async ({
  days,
  userId,
  actionType,
}: {
  days: number;
  userId?: string;
  actionType?: string;
}) => {
  const db = getFirebaseAdminDb();
  let query: Query = db.collection("user_activities");

  if (userId) {
    query = query.where("userId", "==", userId);
  }

  if (actionType) {
    query = query.where("action", "==", actionType);
  }

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  query = query
    .where("timestamp", ">=", daysAgo)
    .orderBy("timestamp", "desc")
    .limit(1000);

  const snapshot = await query.get();

  return snapshot.docs.map((doc) =>
    normalizeActivity({
      id: doc.id,
      ...doc.data(),
    } as ActivityRecord)
  );
};

const filterActivities = (
  activities: ActivityRecord[],
  {
    days,
    userId,
    actionType,
  }: {
    days: number;
    userId?: string;
    actionType?: string;
  }
) => {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  return activities
    .filter((activity) => {
      const timestamp = toDate(activity.timestamp);
      return !timestamp || timestamp >= daysAgo;
    })
    .filter((activity) => (userId ? activity.userId === userId : true))
    .filter((activity) => (actionType ? activity.action === actionType : true))
    .sort((a, b) => {
      const timeA = toDate(a.timestamp)?.getTime() || 0;
      const timeB = toDate(b.timestamp)?.getTime() || 0;
      return timeB - timeA;
    });
};

const getActivities = async ({
  days,
  userId,
  actionType,
}: {
  days: number;
  userId?: string;
  actionType?: string;
}) => {
  try {
    const sqlActivities = await getSqlActivities();

    if (sqlActivities) {
      return filterActivities(sqlActivities, { days, userId, actionType });
    }
  } catch (error) {
    console.error("SQL Connect activity analytics failed:", error);
  }

  return getFirestoreActivities({ days, userId, actionType });
};

const buildSummary = (activities: ActivityRecord[]) => ({
  totalActivities: activities.length,
  uniqueUsers: new Set(activities.map((activity) => activity.userId)).size,
  totalDownloads: activities.filter((activity) => activity.action === "download")
    .length,
  totalPageAccess: activities.filter(
    (activity) => activity.action === "page_access"
  ).length,
  totalLogins: activities.filter((activity) => activity.action === "login").length,
  activityByType: activities.reduce((acc: Record<string, number>, activity) => {
    acc[activity.action] = (acc[activity.action] || 0) + 1;
    return acc;
  }, {}),
  topDownloadedDocuments: Object.entries(
    activities
      .filter((activity) => activity.action === "download")
      .reduce((acc: Record<string, number>, activity) => {
        const fileName =
          getStringValue(activity.actionDetails?.fileName) ||
          getStringValue(activity.fileName);

        if (fileName) {
          acc[fileName] = (acc[fileName] || 0) + 1;
        }

        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10),
  topAccessedPages: Object.entries(
    activities
      .filter((activity) => activity.action === "page_access")
      .reduce((acc: Record<string, number>, activity) => {
        const page =
          getStringValue(activity.actionDetails?.page) ||
          getStringValue(activity.page);

        if (page) {
          acc[page] = (acc[page] || 0) + 1;
        }

        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const adminToken = req.headers["x-admin-token"] as string;
  const isAdmin =
    adminToken ===
    (process.env.ADMIN_TOKEN ||
      process.env.NEXT_PUBLIC_ADMIN_TOKEN ||
      "moxlite-admin-2024");

  if (!isAdmin) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  try {
    const { action } = req.query;
    const body = (req.method === "POST" ? req.body : req.query) as Record<
      string,
      unknown
    >;
    const days = parseInt(String(body.days || 7), 10);
    const userId = typeof body.userId === "string" ? body.userId : undefined;
    const actionType =
      typeof body.actionType === "string" ? body.actionType : undefined;

    switch (action) {
      case "get-all-activities": {
        const activities = await getActivities({ days, userId, actionType });

        return res.status(200).json({
          success: true,
          data: activities,
          total: activities.length,
        });
      }

      case "get-downloads": {
        const downloads = await getActivities({
          days,
          userId,
          actionType: "download",
        });

        return res.status(200).json({
          success: true,
          data: downloads.slice(0, 100),
          total: downloads.length,
        });
      }

      case "get-analytics-summary": {
        const activities = await getActivities({ days, userId, actionType });

        return res.status(200).json({
          success: true,
          data: buildSummary(activities),
        });
      }

      case "get-user-activities": {
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: "userId is required",
          });
        }

        const activities = await getActivities({ days, userId, actionType });

        return res.status(200).json({
          success: true,
          data: activities.slice(0, 100),
          total: activities.length,
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: "Invalid action",
        });
    }
  } catch (error) {
    console.error("Activity analytics error:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}
