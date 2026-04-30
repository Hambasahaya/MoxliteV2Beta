/**
 * Admin Activity History Page
 * Protected admin-only page for viewing user activity logs and analytics
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ActivityHistoryDashboard from "@/components/admin/ActivityHistoryDashboard";
import styles from "@/components/admin/AdminPanel.module.css";

interface AdminAuthState {
  isAuthenticated: boolean;
  adminPassword: string;
  error: string;
}

export default function AdminActivityHistoryPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    adminPassword: "",
    error: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if admin is already authenticated in session
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (isAuth) {
      setAuthState((prev) => ({ ...prev, isAuthenticated: true }));
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Admin password should be stored in environment variable
    // For security, only check on backend in production
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (authState.adminPassword === adminPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        error: "",
        adminPassword: "",
      }));
    } else {
      setAuthState((prev) => ({
        ...prev,
        error: "Invalid admin password",
      }));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setAuthState({
      isAuthenticated: false,
      adminPassword: "",
      error: "",
    });
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  // Login View
  if (!authState.isAuthenticated) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loginContainer}>
          <h1>🔐 Admin Activity Portal</h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
            Sign in to view visitor activity logs and analytics
          </p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            {authState.error && (
              <div className={styles.errorMessage}>{authState.error}</div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="password">Admin Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={authState.adminPassword}
                onChange={(e) =>
                  setAuthState((prev) => ({
                    ...prev,
                    adminPassword: e.target.value,
                    error: "",
                  }))
                }
                required
                autoFocus
              />
            </div>

            <button type="submit">Login to Dashboard</button>
          </form>

          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
            <p style={{ fontSize: "12px", color: "#999", margin: "0" }}>
              💡 For development: Default password is "admin123"
            </p>
            <p style={{ fontSize: "12px", color: "#999", margin: "8px 0 0 0" }}>
              🔒 In production, use NEXT_PUBLIC_ADMIN_PASSWORD environment variable
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className={styles.adminContainer} style={{ padding: "0", minHeight: "100vh" }}>
      <div style={{ paddingTop: "20px" }}>
        <ActivityHistoryDashboard />
      </div>

      {/* Floating Logout Button */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Logout"
          style={{
            padding: "10px 16px",
            fontSize: "14px",
            borderRadius: "8px",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
