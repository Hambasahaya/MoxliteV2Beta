/**
 * API Route: Activity Tracking
 * Logs user activities to Firebase SQL Connect when configured, with Firestore fallback.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { Timestamp } from "firebase-admin/firestore";
import {
  getActivityTableName,
  getFirebaseAdminDb,
  getFirebaseSqlConnect,
} from "@/lib/server/firebaseAdmin";

type ActionDetails = Record<string, unknown>;

interface ActivityLog {
  userId: string;
  userEmail?: string;
  action: string;
  actionDetails: ActionDetails;
  timestamp: Timestamp;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
}

type SqlActivityLog = {
  userId: string;
  userEmail: string | null;
  action: string;
  page: string | null;
  fileName: string | null;
  documentType: string | null;
  productName: string | null;
  productCategory: string | null;
  productFamily: string | null;
  actionDetails: ActionDetails;
  userAgent: string | null;
  ipAddress: string | null;
  sessionId: string | null;
  createdAt: string;
};

type ResponseData = {
  success: boolean;
  id?: string;
  storage?: string[];
  error?: string;
};

const getIpAddress = (req: NextApiRequest) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }

  return forwardedFor?.split(",")[0]?.trim() || req.socket.remoteAddress;
};

const getStringValue = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const buildSqlActivityLog = (
  activityLog: ActivityLog,
  createdAt: Date
): SqlActivityLog => ({
  userId: activityLog.userId,
  userEmail: activityLog.userEmail || null,
  action: activityLog.action,
  page: getStringValue(activityLog.actionDetails.page),
  fileName: getStringValue(activityLog.actionDetails.fileName),
  documentType: getStringValue(activityLog.actionDetails.documentType),
  productName: getStringValue(activityLog.actionDetails.productName),
  productCategory: getStringValue(activityLog.actionDetails.productCategory),
  productFamily: getStringValue(activityLog.actionDetails.productFamily),
  actionDetails: activityLog.actionDetails,
  userAgent: activityLog.userAgent || null,
  ipAddress: activityLog.ipAddress || null,
  sessionId: activityLog.sessionId || null,
  createdAt: createdAt.toISOString(),
});

const logToFirestore = async (activityLog: ActivityLog) => {
  const db = getFirebaseAdminDb();
  const docRef = await db.collection("user_activities").add(activityLog);
  const dateKey = new Date().toISOString().split("T")[0];

  await db
    .collection("activities_by_date")
    .doc(dateKey)
    .collection("logs")
    .add(activityLog);

  return docRef.id;
};

const logToSqlConnect = async (activityLog: ActivityLog, createdAt: Date) => {
  const sqlConnect = getFirebaseSqlConnect();

  if (!sqlConnect) {
    return null;
  }

  const response = await sqlConnect.insert<Record<string, unknown>, SqlActivityLog>(
    getActivityTableName(),
    buildSqlActivityLog(activityLog, createdAt)
  );

  return response.data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { userId, userEmail, action, actionDetails, sessionId } = req.body;

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, action",
      });
    }

    const createdAt = new Date();
    const activityLog: ActivityLog = {
      userId,
      userEmail,
      action,
      actionDetails: actionDetails || {},
      timestamp: Timestamp.fromDate(createdAt),
      userAgent: req.headers["user-agent"],
      ipAddress: getIpAddress(req),
      sessionId,
    };

    const storage: string[] = [];
    let id: string | undefined;

    try {
      const sqlResult = await logToSqlConnect(activityLog, createdAt);

      if (sqlResult) {
        storage.push("sql-connect");
      }
    } catch (error) {
      if (process.env.FIREBASE_ACTIVITY_TRACKING_STRICT_SQL === "true") {
        throw error;
      }

      console.error("SQL Connect activity tracking failed:", error);
    }

    if (
      storage.length === 0 ||
      process.env.FIREBASE_ACTIVITY_TRACKING_MIRROR_FIRESTORE === "true"
    ) {
      id = await logToFirestore(activityLog);
      storage.push("firestore");
    }

    return res.status(200).json({
      success: true,
      id,
      storage,
    });
  } catch (error) {
    console.error("Activity tracking error:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}
