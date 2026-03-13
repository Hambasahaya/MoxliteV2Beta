/**
 * Admin Page - Chatbot Management
 * Hidden page untuk mengelola knowledge base chatbot, produk, dan pengaturan
 * Access: /admin/chatbot-management
 * Password protected
 */

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "@/components/admin/AdminPanel.module.css";

// Dynamic imports untuk mengurangi bundle size
const KnowledgeBaseManager = dynamic(
  () => import("@/components/admin/KnowledgeBaseManager"),
  { ssr: false }
);

const ProductManager = dynamic(
  () => import("@/components/admin/ProductManager"),
  { ssr: false }
);

const ChatbotSettings = dynamic(
  () => import("@/components/admin/ChatbotSettings"),
  { ssr: false }
);

const MarketingConfig = dynamic(
  () => import("@/components/admin/MarketingConfig"),
  { ssr: false }
);

const DashboardStats = dynamic(
  () => import("@/components/admin/DashboardStats"),
  { ssr: false }
);

const ChatbotAnalytics = dynamic(
  () => import("@/components/admin/ChatbotAnalytics"),
  { ssr: false }
);

type Tab = "dashboard" | "analytics" | "knowledge-base" | "products" | "marketing" | "settings";

export default function ChatbotManagementAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("adminToken", data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("❌ Password salah!");
      }
    } catch (err) {
      setError("❌ Gagal melakukan login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setAdminToken("");
    setPassword("");
  };

  // Login UI
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin - Chatbot Management</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className={styles.adminContainer}>
          <div className={styles.loginContainer}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ width: '60px', height: '60px', margin: '0 auto 15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: '40px', height: '40px', fill: 'white' }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
                </svg>
              </div>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#333' }}>🔐 Admin Panel</h1>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>Kelola Chatbot MOXLITE</p>
            </div>
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label>Password Admin</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoFocus
                  required
                />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div style={{ marginTop: "20px", fontSize: "12px", color: "#999" }}>
              <p>
                <strong>⚠️ Halaman ini tersembunyi dan terlindungi password.</strong>
              </p>
              <p>Jangan bagikan akses admin kepada orang yang tidak berhak.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Dashboard UI
  return (
    <>
      <Head>
        <title>Admin - Chatbot Management Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.adminContainer}>
        <div className={styles.dashboard}>
          {/* Header */}
          <div className={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
              <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px', fill: 'white' }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
                </svg>
              </div>
              <div>
                <h1 style={{ margin: '0', fontSize: '26px', color: '#333' }}>🚀 Chatbot Management Dashboard</h1>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>Kelola Knowledge Base, Produk, dan Pengaturan Chatbot</p>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${
                activeTab === "dashboard" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
              style={activeTab === "dashboard" ? { fontWeight: 700 } : {}}
            >
              📊 Dashboard
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "analytics" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("analytics")}
              style={activeTab === "analytics" ? { fontWeight: 700 } : {}}
            >
              📈 Traffic & Analytics
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "knowledge-base" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("knowledge-base")}
              style={activeTab === "knowledge-base" ? { fontWeight: 700 } : {}}
            >
              📚 Knowledge Base
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "products" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("products")}
              style={activeTab === "products" ? { fontWeight: 700 } : {}}
            >
              📦 Produk
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "marketing" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("marketing")}
              style={activeTab === "marketing" ? { fontWeight: 700 } : {}}
            >
              💰 Marketing
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "settings" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("settings")}
              style={activeTab === "settings" ? { fontWeight: 700 } : {}}
            >
              ⚙️ Pengaturan
            </button>
          </div>

          {/* Content */}
          {activeTab === "dashboard" && (
            <DashboardStats adminToken={adminToken} />
          )}

          {activeTab === "analytics" && (
            <ChatbotAnalytics adminToken={adminToken} />
          )}

          {activeTab === "knowledge-base" && (
            <KnowledgeBaseManager adminToken={adminToken} />
          )}

          {activeTab === "products" && (
            <ProductManager adminToken={adminToken} />
          )}

          {activeTab === "marketing" && (
            <MarketingConfig adminToken={adminToken} />
          )}

          {activeTab === "settings" && (
            <ChatbotSettings adminToken={adminToken} />
          )}
        </div>
      </div>
    </>
  );
}
