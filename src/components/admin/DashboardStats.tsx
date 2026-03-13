/**
 * Dashboard Stats Component
 * Menampilkan statistik dan overview dashboard
 */

import React, { useState, useEffect } from "react";
import { getKBStatistics } from "@/lib/kbUtils";
import styles from "./AdminPanel.module.css";

interface DashboardStats {
  totalKBEntries: number;
  totalProducts: number;
  categories: Record<string, number>;
  avgKeywordsPerEntry: number | string;
  lastUpdated: Date | null;
}

interface Props {
  adminToken: string;
}

export default function DashboardStats({ adminToken }: Props) {
  const [stats, setStats] = useState<DashboardStats>({
    totalKBEntries: 0,
    totalProducts: 0,
    categories: {},
    avgKeywordsPerEntry: 0,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch KB stats
        const kbResponse = await fetch("/api/admin/knowledge-base", {
          headers: {
            "x-admin-token": adminToken,
          },
        });

        // Fetch product stats
        const productResponse = await fetch("/api/admin/products", {
          headers: {
            "x-admin-token": adminToken,
          },
        });

        let kbStats: any = {
          categories: {},
          averageKeywordsPerEntry: 0,
          lastUpdated: null,
        };
        let totalKBEntries = 0;
        let totalProducts = 0;

        if (kbResponse.ok) {
          const kbData = await kbResponse.json();
          const entries = kbData.data || [];
          kbStats = getKBStatistics(entries);
          totalKBEntries = entries.length;
        }

        if (productResponse.ok) {
          const productData = await productResponse.json();
          totalProducts = productData.data?.length || 0;
        }

        setStats({
          totalKBEntries,
          totalProducts,
          categories: kbStats.categories,
          avgKeywordsPerEntry: kbStats.averageKeywordsPerEntry,
          lastUpdated: kbStats.lastUpdated instanceof Date ? kbStats.lastUpdated : null,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (adminToken) {
      fetchStats();
    }
  }, [adminToken]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className={styles.section}>
      <h2>📊 Dashboard Statistics</h2>

      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <>
          {/* Main Stats */}
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <strong>📚 Knowledge Base Entries</strong>
              <div style={{ fontSize: "24px", color: "#667eea", marginTop: "5px" }}>
                {stats.totalKBEntries}
              </div>
              <small>Total pertanyaan & jawaban</small>
            </div>

            <div className={styles.summaryItem}>
              <strong>📦 Total Products</strong>
              <div style={{ fontSize: "24px", color: "#667eea", marginTop: "5px" }}>
                {stats.totalProducts || "N/A"}
              </div>
              <small>Sinkronisasi dengan database</small>
            </div>

            <div className={styles.summaryItem}>
              <strong>🏷️ Avg Keywords/Entry</strong>
              <div style={{ fontSize: "24px", color: "#667eea", marginTop: "5px" }}>
                {stats.avgKeywordsPerEntry}
              </div>
              <small>Rata-rata keywords per entry</small>
            </div>

            <div className={styles.summaryItem}>
              <strong>⏱️ Last Update</strong>
              <div
                style={{
                  fontSize: "14px",
                  color: "#667eea",
                  marginTop: "5px",
                  wordBreak: "break-word",
                }}
              >
                {formatDate(stats.lastUpdated)}
              </div>
              <small>Waktu update terakhir</small>
            </div>
          </div>

          {/* Categories Breakdown */}
          {Object.keys(stats.categories).length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3>📂 Knowledge Base Categories</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Jumlah Entries</th>
                      <th>Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.categories).map(
                      ([category, count]) => {
                        const percentage = (
                          (count / stats.totalKBEntries) *
                          100
                        ).toFixed(1);
                        return (
                          <tr key={category}>
                            <td>
                              <span className={styles.badge}>{category}</span>
                            </td>
                            <td>{count}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    flex: 1,
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
                                      width: `${percentage}%`,
                                    }}
                                  />
                                </div>
                                <span style={{ minWidth: "40px" }}>
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Health Check */}
          <div className={styles.infoBox} style={{ marginTop: "30px" }}>
            <h3>✅ System Health</h3>
            <ul>
              <li>
                <strong>API Status:</strong>{" "}
                <span style={{ color: "#27ae60" }}>✅ Connected</span>
              </li>
              <li>
                <strong>Database:</strong>{" "}
                <span style={{ color: "#27ae60" }}>✅ Operational</span>
              </li>
              <li>
                <strong>Knowledge Base:</strong>{" "}
                {stats.totalKBEntries > 50 ? (
                  <span style={{ color: "#27ae60" }}>✅ Healthy</span>
                ) : stats.totalKBEntries > 10 ? (
                  <span style={{ color: "#f39c12" }}>⚠️ Basic</span>
                ) : (
                  <span style={{ color: "#e74c3c" }}>❌ Needs Entries</span>
                )}
              </li>
              <li>
                <strong>Chatbot:</strong>{" "}
                <span style={{ color: "#27ae60" }}>✅ Ready</span>
              </li>
            </ul>

            {stats.totalKBEntries < 20 && (
              <div
                style={{
                  background: "#fff3cd",
                  color: "#856404",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              >
                💡 <strong>Tip:</strong> Tambahkan minimal 20-50 knowledge base
                entries untuk chatbot yang lebih responsif dan akurat.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
