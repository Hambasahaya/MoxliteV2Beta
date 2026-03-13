/**
 * API Route: Chatbot Analytics
 * Handles analytics data for chatbot usage, traffic, and geographical distribution
 */

import type { NextApiRequest, NextApiResponse } from "next";

export interface ChatbotSession {
  id: string;
  sessionStart: Date;
  sessionEnd?: Date;
  messageCount: number;
  country?: string;
  city?: string;
  region?: string;
  userType?: "rental" | "project" | "unknown";
  usedUpload?: boolean;
  usedExport?: boolean;
  duration?: number; // in seconds
}

export interface AnalyticsData {
  totalSessions: number;
  activeSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
  totalUploadUsed: number;
  totalExportUsed: number;
  avgSessionDuration: number;
  geographicalData: Record<string, number>;
  userTypeDistribution: Record<string, number>;
  dailyStats: Record<string, number>;
}

// In-memory storage for sessions (replace with database in production)
let sessions: ChatbotSession[] = [];

function verifyAdminToken(req: NextApiRequest): boolean {
  const token = req.headers["x-admin-token"] as string;
  const validTokens = [
    process.env.NEXT_PUBLIC_ADMIN_TOKEN,
    "moxlite-admin-2024",
    "admin123"
  ].filter(Boolean);
  
  return validTokens.includes(token);
}

function calculateAnalytics(): AnalyticsData {
  const completedSessions = sessions.filter((s) => s.sessionEnd);
  const activeSessions = sessions.filter((s) => !s.sessionEnd);

  const geographicalData: Record<string, number> = {};
  const userTypeDistribution: Record<string, number> = {
    rental: 0,
    project: 0,
    unknown: 0,
  };
  const dailyStats: Record<string, number> = {};

  let totalMessages = 0;
  let totalDuration = 0;
  let uploadCount = 0;
  let exportCount = 0;

  sessions.forEach((session) => {
    // Geographic data by city
    if (session.city) {
      geographicalData[session.city] = (geographicalData[session.city] || 0) + 1;
    }

    // User type distribution
    const userType = session.userType || "unknown";
    userTypeDistribution[userType] =
      (userTypeDistribution[userType] || 0) + 1;

    // Daily stats
    const date = new Date(session.sessionStart).toISOString().split("T")[0];
    dailyStats[date] = (dailyStats[date] || 0) + 1;

    // Aggregate stats
    totalMessages += session.messageCount;
    if (session.duration) totalDuration += session.duration;
    if (session.usedUpload) uploadCount++;
    if (session.usedExport) exportCount++;
  });

  const avgMessagesPerSession =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((sum, s) => sum + s.messageCount, 0) /
            completedSessions.length
        )
      : 0;

  const avgSessionDuration =
    completedSessions.length > 0
      ? Math.round(totalDuration / completedSessions.length)
      : 0;

  return {
    totalSessions: sessions.length,
    activeSessions: activeSessions.length,
    totalMessages,
    avgMessagesPerSession,
    totalUploadUsed: uploadCount,
    totalExportUsed: exportCount,
    avgSessionDuration,
    geographicalData,
    userTypeDistribution,
    dailyStats,
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { action } = req.query;

  try {
    switch (action) {
      case "get-analytics":
        return res.status(200).json({
          success: true,
          data: calculateAnalytics(),
        });

      case "get-sessions":
        return res.status(200).json({
          success: true,
          data: sessions.sort(
            (a, b) =>
              new Date(b.sessionStart).getTime() -
              new Date(a.sessionStart).getTime()
          ),
          total: sessions.length,
        });

      case "add-session":
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method not allowed" });
        }

        const {
          sessionStart,
          country,
          city,
          region,
          userType,
        } = req.body;

        if (!sessionStart) {
          return res.status(400).json({ error: "sessionStart is required" });
        }

        const newSession: ChatbotSession = {
          id: `session-${Date.now()}`,
          sessionStart: new Date(sessionStart),
          messageCount: 0,
          country,
          city,
          region,
          userType,
          usedUpload: false,
          usedExport: false,
        };

        sessions.push(newSession);
        return res.status(201).json({
          success: true,
          data: newSession,
        });

      case "update-session":
        if (req.method !== "PUT") {
          return res.status(405).json({ error: "Method not allowed" });
        }

        const {
          sessionId,
          messageCount,
          usedUpload,
          usedExport,
          sessionEnd,
        } = req.body;

        const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
        if (sessionIndex === -1) {
          return res.status(404).json({ error: "Session not found" });
        }

        if (messageCount !== undefined)
          sessions[sessionIndex].messageCount = messageCount;
        if (usedUpload !== undefined)
          sessions[sessionIndex].usedUpload = usedUpload;
        if (usedExport !== undefined)
          sessions[sessionIndex].usedExport = usedExport;
        if (sessionEnd) {
          sessions[sessionIndex].sessionEnd = new Date(sessionEnd);
          sessions[sessionIndex].duration =
            (new Date(sessionEnd).getTime() -
              new Date(sessions[sessionIndex].sessionStart).getTime()) /
            1000;
        }

        return res.status(200).json({
          success: true,
          data: sessions[sessionIndex],
        });

      case "reset-analytics":
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method not allowed" });
        }

        sessions = [];
        return res.status(200).json({
          success: true,
          message: "Analytics reset successfully",
        });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
