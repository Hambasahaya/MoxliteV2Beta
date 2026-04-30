/**
 * Admin Dashboard Index
 * Entry point for admin panel with navigation menu
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminMenu from "@/components/admin/AdminMenu";
import styles from "@/components/admin/AdminPanel.module.css";

export default function AdminDashboardIndex() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setError("");
      setPassword("");
    } else {
      setError("Invalid admin password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  };

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loginContainer}>
          <h1>🔐 Admin Panel</h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
            Access the admin control panel
          </p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="password">Admin Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                autoFocus
              />
            </div>

            <button type="submit">Enter Admin Panel</button>
          </form>

          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
            <p style={{ fontSize: "12px", color: "#999", margin: "0" }}>
              💡 Development: Default password is "admin123"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "40px 20px" }}>
      <AdminMenu onLogout={handleLogout} showLogout={true} />
    </div>
  );
}
