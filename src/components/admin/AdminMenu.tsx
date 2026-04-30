/**
 * Admin Navigation Menu
 * Links to all admin pages
 */

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./AdminPanel.module.css";

interface AdminMenuProps {
  onLogout?: () => void;
  showLogout?: boolean;
}

export default function AdminMenu({ onLogout, showLogout = true }: AdminMenuProps) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const menuItems = [
    {
      label: "📊 Activity History",
      href: "/admin/activity-history",
      icon: "📊",
      description: "View all user activities and analytics",
    },
    {
      label: "💬 Chatbot Management",
      href: "/admin/chatbot-management",
      icon: "💬",
      description: "Manage chatbot KB and products",
    },
  ];

  return (
    <div className={styles.adminMenuContainer}>
      <div className={styles.adminMenuHeader}>
        <h2>Admin Control Panel</h2>
        <p>Manage your Moxlite website</p>
      </div>

      <div className={styles.adminMenuItems}>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={`${styles.adminMenuItem} ${
                isActive(item.href) ? styles.active : ""
              }`}
            >
              <div className={styles.menuItemIcon}>{item.icon}</div>
              <div className={styles.menuItemContent}>
                <div className={styles.menuItemLabel}>{item.label}</div>
                <div className={styles.menuItemDescription}>{item.description}</div>
              </div>
              <div className={styles.menuItemArrow}>→</div>
            </a>
          </Link>
        ))}
      </div>

      {showLogout && onLogout && (
        <button onClick={onLogout} className={styles.adminMenuLogout}>
          🚪 Logout
        </button>
      )}
    </div>
  );
}
