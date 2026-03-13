/**
 * Chatbot Analytics Component
 * Displays traffic, usage statistics, and geographical distribution
 */

import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";

interface AnalyticsData {
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

interface ChatbotSession {
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
  duration?: number;
}

interface Props {
  adminToken: string;
}

export default function ChatbotAnalytics({ adminToken }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sessions, setSessions] = useState<ChatbotSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"overview" | "geo" | "sessions">(
    "overview"
  );

  useEffect(() => {
    fetchAnalytics();
  }, [adminToken]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [analyticsRes, sessionsRes] = await Promise.all([
        fetch("/api/admin/chatbot-analytics?action=get-analytics", {
          headers: { "x-admin-token": adminToken },
        }),
        fetch("/api/admin/chatbot-analytics?action=get-sessions", {
          headers: { "x-admin-token": adminToken },
        }),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.data);
      }

      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        setSessions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className={styles.section}>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className={styles.section}>Gagal memuat analytics</div>;
  }

  // Sort geographic data by count
  const sortedGeoData = Object.entries(analytics.geographicalData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const totalGeoDuration = Object.values(analytics.geographicalData).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>📊 Chatbot Analytics & Traffic</h2>
        <span className={styles.badge}>Real-time Statistics</span>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Total Sessions */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            borderRadius: "8px",
            borderLeft: "4px solid #667eea",
          }}
        >
          <div style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>
            TOTAL SESSIONS
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#667eea",
              marginTop: "5px",
            }}
          >
            {analytics.totalSessions}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            👥 Pengguna yang telah menggunakan chatbot
          </div>
        </div>

        {/* Active Sessions */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(46, 204, 113, 0.1) 100%)",
            borderRadius: "8px",
            borderLeft: "4px solid #27ae60",
          }}
        >
          <div style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>
            ACTIVE SESSIONS
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#27ae60",
              marginTop: "5px",
            }}
          >
            {analytics.activeSessions}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            🟢 Sedang menggunakan sekarang
          </div>
        </div>

        {/* Total Messages */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(241, 196, 15, 0.1) 100%)",
            borderRadius: "8px",
            borderLeft: "4px solid #e67e22",
          }}
        >
          <div style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>
            TOTAL MESSAGES
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#e67e22",
              marginTop: "5px",
            }}
          >
            {analytics.totalMessages}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            💬 Pesan yang dikirim ke chatbot
          </div>
        </div>

        {/* Avg Session Duration */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(108, 52, 131, 0.1) 100%)",
            borderRadius: "8px",
            borderLeft: "4px solid #9b59b6",
          }}
        >
          <div style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>
            AVG DURATION
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#9b59b6",
              marginTop: "5px",
            }}
          >
            {analytics.avgSessionDuration}s
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            ⏱️ Rata-rata durasi session
          </div>
        </div>

        {/* Upload Usage */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(41, 128, 185, 0.1) 100%)",
            borderRadius: "8px",
            borderLeft: "4px solid #3498db",
          }}
        >
          <div style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>
            UPLOAD USED
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#3498db",
              marginTop: "5px",
            }}
          >
            {analytics.totalUploadUsed}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            📎 Fitur upload gambar
          </div>
        </div>

        {/* Export Usage */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%)",
            borderRadius: "8px",
            borderLeft: "4px solid #2ecc71",
          }}
        >
          <div style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>
            EXPORT USED
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#2ecc71",
              marginTop: "5px",
            }}
          >
            {analytics.totalExportUsed}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            📄 Export quotation PDF
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          padding: "15px",
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <button
          onClick={() => setActiveView("overview")}
          style={{
            padding: "8px 16px",
            background: activeView === "overview" ? "#667eea" : "#ddd",
            color: activeView === "overview" ? "white" : "#333",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.3s",
          }}
        >
          📈 Overview
        </button>
        <button
          onClick={() => setActiveView("geo")}
          style={{
            padding: "8px 16px",
            background: activeView === "geo" ? "#667eea" : "#ddd",
            color: activeView === "geo" ? "white" : "#333",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.3s",
          }}
        >
          🌍 Geographic
        </button>
        <button
          onClick={() => setActiveView("sessions")}
          style={{
            padding: "8px 16px",
            background: activeView === "sessions" ? "#667eea" : "#ddd",
            color: activeView === "sessions" ? "white" : "#333",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.3s",
          }}
        >
          👥 Sessions
        </button>
      </div>

      {/* Overview Tab */}
      {activeView === "overview" && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>
            📊 Usage Summary
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginBottom: "30px",
            }}
          >
            {/* User Type Distribution */}
            <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
              <h4 style={{ marginTop: 0, color: "#333" }}>👤 User Type Distribution</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {Object.entries(analytics.userTypeDistribution).map(
                    ([type, count]) => (
                      <tr
                        key={type}
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "10px 0",
                        }}
                      >
                        <td style={{ padding: "10px 0", fontWeight: 600 }}>
                          {type === "rental" ? "🏪 Rental" : type === "project" ? "🎬 Project" : "❓ Unknown"}
                        </td>
                        <td
                          style={{
                            padding: "10px 0",
                            textAlign: "right",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#667eea",
                          }}
                        >
                          {count}
                        </td>
                        <td
                          style={{
                            padding: "10px 0 10px 15px",
                            fontSize: "12px",
                            color: "#999",
                          }}
                        >
                          {analytics.totalSessions > 0
                            ? Math.round(
                                (count / analytics.totalSessions) * 100
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Feature Usage */}
            <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
              <h4 style={{ marginTop: 0, color: "#333" }}>🔧 Feature Usage</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    <span>📎 Upload Image</span>
                    <strong style={{ color: "#667eea" }}>
                      {analytics.totalUploadUsed}
                    </strong>
                  </div>
                  <div
                    style={{
                      background: "#e0e7ff",
                      height: "8px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "#667eea",
                        height: "100%",
                        width: `${
                          analytics.totalSessions > 0
                            ? (analytics.totalUploadUsed /
                                analytics.totalSessions) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    <span>📄 Export PDF</span>
                    <strong style={{ color: "#667eea" }}>
                      {analytics.totalExportUsed}
                    </strong>
                  </div>
                  <div
                    style={{
                      background: "#e0e7ff",
                      height: "8px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "#667eea",
                        height: "100%",
                        width: `${
                          analytics.totalSessions > 0
                            ? (analytics.totalExportUsed /
                                analytics.totalSessions) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Geographic Tab */}
      {activeView === "geo" && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>
            🌍 Geographic Distribution
          </h3>

          <div
            style={{
              padding: "20px",
              background: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <p style={{ marginTop: 0, color: "#666", fontSize: "14px" }}>
              Distribusi pengguna chatbot berdasarkan kota/region
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              {sortedGeoData.length > 0 ? (
                sortedGeoData.map(([city, count]) => (
                  <div
                    key={city}
                    style={{
                      padding: "15px",
                      background: "white",
                      borderRadius: "6px",
                      border: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <h5
                          style={{
                            margin: "0 0 2px 0",
                            color: "#333",
                            fontSize: "14px",
                          }}
                        >
                          📍 {city}
                        </h5>
                      </div>
                      <strong
                        style={{
                          color: "#667eea",
                          fontSize: "16px",
                        }}
                      >
                        {count}
                      </strong>
                    </div>

                    <div
                      style={{
                        background: "#e0e7ff",
                        height: "6px",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          background: "#667eea",
                          height: "100%",
                          width: `${
                            totalGeoDuration > 0
                              ? (count / totalGeoDuration) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      {analytics.totalSessions > 0
                        ? Math.round((count / analytics.totalSessions) * 100)
                        : 0}
                      % dari total
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#999" }}>Belum ada data geografis</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeView === "sessions" && (
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>
            👥 Recent Sessions
          </h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Lokasi</th>
                  <th>Type</th>
                  <th>Pesan</th>
                  <th>Durasi</th>
                  <th>Fitur</th>
                  <th>Mulai</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <tr key={session.id}>
                      <td style={{ fontSize: "12px", fontFamily: "monospace" }}>
                        {session.id}
                      </td>
                      <td>
                        {session.city ? (
                          <div>
                            <strong>{session.city}</strong>
                            <br />
                            <small style={{ color: "#999" }}>
                              {session.region}
                            </small>
                          </div>
                        ) : (
                          "Unknown"
                        )}
                      </td>
                      <td>
                        {session.userType === "rental" ? (
                          <span style={{ color: "#667eea" }}>🏪 Rental</span>
                        ) : session.userType === "project" ? (
                          <span style={{ color: "#e67e22" }}>🎬 Project</span>
                        ) : (
                          <span style={{ color: "#999" }}>❓ -</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 600, color: "#667eea" }}>
                        {session.messageCount}
                      </td>
                      <td>
                        {session.sessionEnd ? (
                          formatDuration(session.duration)
                        ) : (
                          <span style={{ color: "#27ae60", fontWeight: 600 }}>
                            Active
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "5px" }}>
                          {session.usedUpload && (
                            <span
                              title="Upload used"
                              style={{
                                background: "#e0e7ff",
                                color: "#667eea",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                fontSize: "11px",
                              }}
                            >
                              📎
                            </span>
                          )}
                          {session.usedExport && (
                            <span
                              title="Export used"
                              style={{
                                background: "#f0fdf4",
                                color: "#16a34a",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                fontSize: "11px",
                              }}
                            >
                              📄
                            </span>
                          )}
                          {!session.usedUpload && !session.usedExport && (
                            <span style={{ color: "#999", fontSize: "12px" }}>
                              -
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: "12px", color: "#666" }}>
                        {formatDate(session.sessionStart)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "30px" }}>
                      Belum ada session
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)",
          borderRadius: "8px",
          borderLeft: "4px solid #667eea",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
          ℹ️ Tentang Analytics
        </h4>
        <ul style={{ margin: "0", paddingLeft: "20px", color: "#666", fontSize: "13px" }}>
          <li>Data tracking dimulai saat pengguna membuka chatbot</li>
          <li>Lokasi berdasarkan IP address pengguna</li>
          <li>Session berlangsung dari pembukaan hingga penutupan chatbot</li>
          <li>Durasi dihitung dari waktu mulai hingga selesai komunikasi</li>
          <li>Data disimpan secara real-time untuk analisis</li>
        </ul>
      </div>
    </div>
  );
}
