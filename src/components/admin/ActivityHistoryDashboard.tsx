/**
 * Activity History Dashboard
 * Admin-only dashboard for viewing all user activities with analytics
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Chart as ChartType, ChartConfiguration } from "chart.js";
import {
  ActivityHistory,
  ActivityHistoryService,
} from "@/lib/activityHistoryService";
import styles from "./AdminPanel.module.css";

interface ActivityStats {
  totalActivities: number;
  activeUsers: number;
  pageViews: number;
  downloads: number;
  blockedDownloads: number;
  logins: number;
  signups: number;
  uniqueSessions: number;
  byAction: Record<string, number>;
  byPage: Record<string, number>;
  byCountry: Record<string, number>;
  byCity: Record<string, number>;
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  last24Hours: TimeSeriesPoint[];
  recentActivities: ActivityHistory[];
  lastActivityAt?: number;
}

interface ChartDataPoint {
  label: string;
  value: number;
  percentage: number;
}

interface TimeSeriesPoint {
  label: string;
  value: number;
}

interface ActivityGroup {
  key: string;
  label: string;
  grouping: "email" | "ip" | "user";
  ipAddress?: string;
  activities: ActivityHistory[];
}

interface ChartCanvasProps {
  config: ChartConfiguration;
  height?: number;
}

type DateRangeKey = "today" | "week" | "month" | "all";

const ADMIN_ACTIVITY_HISTORY_PATH = "/admin/activity-history";
const REALTIME_ACTIVITY_LIMIT = 5000;
const GROUPS_PER_PAGE = 10;
const COMPACT_GROUP_ACTIVITY_ROWS = 5;
const CHART_COLORS = [
  "#4f6df5",
  "#13a8a1",
  "#f59f00",
  "#ef476f",
  "#2f9e44",
  "#8b5cf6",
  "#0ea5e9",
  "#f97316",
];

const pad = (value: number) => String(value).padStart(2, "0");

const getStringValue = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

const formatActionLabel = (action: string) =>
  action
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) {
    return "-";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const formatShortDate = (date: Date) =>
  `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

const formatRelativeTime = (timestamp?: number) => {
  if (!timestamp) {
    return "-";
  }

  const diff = Date.now() - timestamp;
  if (diff < 60_000) {
    return "just now";
  }

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} h ago`;
  }

  return `${Math.floor(hours / 24)} d ago`;
};

const getStartOfDay = (date: Date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const getDateRangeMeta = (dateRange: DateRangeKey) => {
  const now = new Date();
  const end = now.getTime();

  if (dateRange === "today") {
    const start = getStartOfDay(now);
    return {
      start: start.getTime(),
      end,
      label: `Today, ${formatShortDate(now)}`,
    };
  }

  if (dateRange === "week") {
    const start = getStartOfDay(now);
    start.setDate(start.getDate() - 6);
    return {
      start: start.getTime(),
      end,
      label: `${formatShortDate(start)} - ${formatShortDate(now)}`,
    };
  }

  if (dateRange === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      start: start.getTime(),
      end,
      label: `${formatShortDate(start)} - ${formatShortDate(now)}`,
    };
  }

  return {
    start: 0,
    end,
    label: "All records",
  };
};

const getActivityIdentity = (activity: ActivityHistory) => {
  const email = getStringValue(activity.userEmail)?.toLowerCase();
  if (email) {
    return {
      key: `email:${email}`,
      label: email,
      grouping: "email" as const,
      ipAddress: getStringValue(activity.ipAddress),
    };
  }

  const ipAddress = getStringValue(activity.ipAddress);
  if (ipAddress) {
    return {
      key: `ip:${ipAddress}`,
      label: ipAddress,
      grouping: "ip" as const,
      ipAddress,
    };
  }

  return {
    key: `user:${activity.userId}`,
    label: activity.userId,
    grouping: "user" as const,
  };
};

const getActionDetails = (activity: ActivityHistory) =>
  activity.actionDetails || {};

const getPathname = (value?: string) => {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, "https://moxlite.local").pathname;
  } catch {
    return value;
  }
};

const getPageNameFromPath = (value?: string) => {
  const pathname = getPathname(value);
  if (!pathname) {
    return undefined;
  }

  const sanitized = pathname.split("?")[0].split("#")[0].trim();
  if (!sanitized || sanitized === "/") {
    return "home";
  }

  const segments = sanitized.split("/").filter(Boolean);
  const pageName = segments[segments.length - 1] || "home";
  return decodeURIComponent(pageName).replace(/[-_]+/g, " ");
};

const getActivityPageName = (activity: ActivityHistory) => {
  const details = getActionDetails(activity);

  return getPageNameFromPath(
    getStringValue(details.page) ||
      getStringValue(details.currentPath) ||
      getStringValue(details.currentUrl)
  );
};

const isAdminActivityHistoryActivity = (activity: ActivityHistory) => {
  const details = getActionDetails(activity);
  const possiblePaths = [
    getStringValue(details.page),
    getStringValue(details.currentPath),
    getStringValue(details.currentUrl),
  ];

  return possiblePaths.some((value) => {
    const pathname = getPathname(value);
    return pathname === ADMIN_ACTIVITY_HISTORY_PATH;
  });
};

const getActivityDetailText = (activity: ActivityHistory) => {
  const details = getActionDetails(activity);

  if (activity.action === "login" || activity.action === "signup") {
    return getStringValue(details.status) || "success";
  }

  if (activity.action === "logout") {
    return "signed out";
  }

  if (activity.action === "download_blocked") {
    return (
      getStringValue(details.fileName) ||
      getStringValue(details.documentType) ||
      "login required"
    );
  }

  if (activity.action === "download") {
    return (
      getStringValue(details.fileName) ||
      getStringValue(details.documentType) ||
      getStringValue(details.productName) ||
      "-"
    );
  }

  return (
    getActivityPageName(activity) ||
    getStringValue(details.productName) ||
    getStringValue(details.productFamily) ||
    "-"
  );
};

const getActivityLocation = (activity: ActivityHistory) =>
  activity.city || activity.region || activity.country || "-";

const getActivityCountry = (activity: ActivityHistory) =>
  activity.country || "Unknown";

const getDeviceType = (userAgent?: string) => {
  const agent = userAgent?.toLowerCase() || "";
  if (!agent) {
    return "Unknown";
  }

  if (/ipad|tablet/.test(agent)) {
    return "Tablet";
  }

  if (/mobile|android|iphone|ipod/.test(agent)) {
    return "Mobile";
  }

  return "Desktop";
};

const getBrowserName = (userAgent?: string) => {
  const agent = userAgent || "";
  if (!agent) {
    return "Unknown";
  }

  if (/Edg\//.test(agent)) {
    return "Edge";
  }

  if (/Firefox\//.test(agent)) {
    return "Firefox";
  }

  if (/Safari\//.test(agent) && !/Chrome\//.test(agent)) {
    return "Safari";
  }

  if (/Chrome\//.test(agent)) {
    return "Chrome";
  }

  return "Other";
};

const filterActivitiesByDateRange = (
  allActivities: ActivityHistory[],
  dateRange: DateRangeKey
) => {
  if (dateRange === "all") {
    return allActivities;
  }

  const { start, end } = getDateRangeMeta(dateRange);

  return allActivities.filter((activity) => {
    const timestamp =
      typeof activity.timestamp === "number"
        ? activity.timestamp
        : Number(activity.timestamp);

    return timestamp >= start && timestamp <= end;
  });
};

const filterActivities = (
  activities: ActivityHistory[],
  searchTerm: string,
  filterAction: string
) => {
  let filtered = [...activities];

  if (searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (activity) =>
        activity.userId.toLowerCase().includes(normalizedSearch) ||
        activity.userEmail?.toLowerCase().includes(normalizedSearch) ||
        activity.country?.toLowerCase().includes(normalizedSearch) ||
        activity.city?.toLowerCase().includes(normalizedSearch) ||
        activity.ipAddress?.toLowerCase().includes(normalizedSearch) ||
        activity.action.toLowerCase().includes(normalizedSearch) ||
        getActivityDetailText(activity).toLowerCase().includes(normalizedSearch)
    );
  }

  if (filterAction) {
    filtered = filtered.filter((activity) => activity.action === filterAction);
  }

  return filtered;
};

const groupActivities = (activities: ActivityHistory[]) => {
  const groups = new Map<string, ActivityGroup>();

  activities.forEach((activity) => {
    const identity = getActivityIdentity(activity);
    const existingGroup = groups.get(identity.key);

    if (existingGroup) {
      existingGroup.activities.push(activity);
      return;
    }

    groups.set(identity.key, {
      key: identity.key,
      label: identity.label,
      grouping: identity.grouping,
      ipAddress: identity.ipAddress,
      activities: [activity],
    });
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      activities: [...group.activities].sort((a, b) => b.timestamp - a.timestamp),
    }))
    .sort((a, b) => b.activities[0].timestamp - a.activities[0].timestamp);
};

const incrementCount = (bucket: Record<string, number>, key?: string) => {
  if (!key) {
    return;
  }

  bucket[key] = (bucket[key] || 0) + 1;
};

const buildLast24Hours = (activities: ActivityHistory[]): TimeSeriesPoint[] => {
  const now = new Date();
  now.setMinutes(0, 0, 0);

  const bucketKeys: string[] = [];
  const buckets: Record<string, TimeSeriesPoint> = {};

  for (let index = 23; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setHours(now.getHours() - index);
    const key = String(date.getTime());
    bucketKeys.push(key);
    buckets[key] = {
      label: `${pad(date.getHours())}:00`,
      value: 0,
    };
  }

  activities.forEach((activity) => {
    const date = new Date(activity.timestamp);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    date.setMinutes(0, 0, 0);
    const key = String(date.getTime());
    if (buckets[key]) {
      buckets[key].value += 1;
    }
  });

  return bucketKeys.map((key) => buckets[key]);
};

const getTopItems = (
  items: Record<string, number>,
  limit: number = 5
): ChartDataPoint[] => {
  const total = Object.values(items).reduce((sum, current) => sum + current, 0);
  const safeTotal = total || 1;

  return Object.entries(items)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([label, value]) => ({
      label,
      value,
      percentage: Math.round((value / safeTotal) * 100),
    }));
};

const hasAnyData = (values: number[]) => values.some((value) => value > 0);

const chartBaseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#334155",
        boxWidth: 12,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: "#111827",
      borderColor: "rgba(255, 255, 255, 0.12)",
      borderWidth: 1,
      padding: 12,
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
    },
  },
};

const cartesianChartOptions = {
  ...chartBaseOptions,
  scales: {
    x: {
      grid: {
        color: "rgba(148, 163, 184, 0.16)",
      },
      ticks: {
        color: "#64748b",
        maxRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.2)",
      },
      ticks: {
        color: "#64748b",
        precision: 0,
      },
    },
  },
};

function ChartCanvas({ config, height = 300 }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartType | null>(null);

  useEffect(() => {
    let isActive = true;

    chartRef.current?.destroy();
    chartRef.current = null;

    if (!canvasRef.current) {
      return () => {
        isActive = false;
      };
    }

    import("chart.js/auto").then(({ default: Chart }) => {
      if (!isActive || !canvasRef.current) {
        return;
      }

      chartRef.current = new Chart(canvasRef.current, config);
    });

    return () => {
      isActive = false;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [config]);

  return (
    <div className={styles.chartCanvas} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default function ActivityHistoryDashboard() {
  const [allActivities, setAllActivities] = useState<ActivityHistory[]>([]);
  const [activities, setActivities] = useState<ActivityHistory[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "activities" | "analytics"
  >("overview");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRangeKey>("today");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [subscriptionAttempt, setSubscriptionAttempt] = useState(0);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = ActivityHistoryService.onAllActivitiesChange(
      (nextActivities) => {
        setAllActivities(
          nextActivities.filter(
            (activity) => !isAdminActivityHistoryActivity(activity)
          )
        );
        setError(null);
        setLoading(false);
      },
      (subscriptionError) => {
        console.error("Error fetching activities:", subscriptionError);
        setError("Failed to load activities. Please try again.");
        setLoading(false);
      },
      REALTIME_ACTIVITY_LIMIT
    );

    return () => {
      unsubscribe();
    };
  }, [subscriptionAttempt]);

  useEffect(() => {
    const filtered = filterActivitiesByDateRange(allActivities, dateRange);

    setActivities(filtered);
    calculateStats(filtered);
  }, [allActivities, dateRange]);

  useEffect(() => {
    setPage(0);
    setExpandedGroups({});
  }, [searchTerm, filterAction, dateRange]);

  const calculateStats = (nextActivities: ActivityHistory[]) => {
    const nextStats: ActivityStats = {
      totalActivities: nextActivities.length,
      activeUsers: new Set(
        nextActivities.map((activity) => getActivityIdentity(activity).key)
      ).size,
      pageViews: nextActivities.filter((activity) => activity.action === "page_access")
        .length,
      downloads: nextActivities.filter((activity) => activity.action === "download")
        .length,
      blockedDownloads: nextActivities.filter(
        (activity) => activity.action === "download_blocked"
      ).length,
      logins: nextActivities.filter((activity) => activity.action === "login")
        .length,
      signups: nextActivities.filter((activity) => activity.action === "signup")
        .length,
      uniqueSessions: new Set(
        nextActivities
          .map((activity) => getStringValue(activity.sessionId))
          .filter(Boolean)
      ).size,
      byAction: {},
      byPage: {},
      byCountry: {},
      byCity: {},
      byDevice: {},
      byBrowser: {},
      last24Hours: buildLast24Hours(nextActivities),
      recentActivities: nextActivities.slice(0, 6),
      lastActivityAt: nextActivities[0]?.timestamp,
    };

    nextActivities.forEach((activity) => {
      incrementCount(nextStats.byAction, activity.action);
      incrementCount(nextStats.byPage, getActivityPageName(activity));
      incrementCount(nextStats.byCountry, getActivityCountry(activity));
      incrementCount(nextStats.byCity, getActivityLocation(activity));
      incrementCount(nextStats.byDevice, getDeviceType(activity.userAgent));
      incrementCount(nextStats.byBrowser, getBrowserName(activity.userAgent));
    });

    setStats(nextStats);
  };

  const filteredActivities = filterActivities(
    activities,
    searchTerm,
    filterAction
  );
  const groupedActivities = groupActivities(filteredActivities);
  const totalPages = Math.max(
    1,
    Math.ceil(groupedActivities.length / GROUPS_PER_PAGE)
  );
  const paginatedGroups = groupedActivities.slice(
    page * GROUPS_PER_PAGE,
    (page + 1) * GROUPS_PER_PAGE
  );

  useEffect(() => {
    if (page >= totalPages) {
      setPage(Math.max(totalPages - 1, 0));
    }
  }, [page, totalPages]);

  const topActions = stats ? getTopItems(stats.byAction, 6) : [];
  const topPages = stats ? getTopItems(stats.byPage, 8) : [];
  const topLocations = stats ? getTopItems(stats.byCity, 8) : [];
  const topCountries = stats ? getTopItems(stats.byCountry, 6) : [];
  const topDevices = stats ? getTopItems(stats.byDevice, 5) : [];
  const topBrowsers = stats ? getTopItems(stats.byBrowser, 5) : [];
  const last24Values = stats?.last24Hours.map((item) => item.value) || [];
  const topAction = topActions[0]?.label || "-";
  const topPage = topPages[0]?.label || "-";
  const topLocation = topLocations[0]?.label || "-";
  const dateRangeMeta = getDateRangeMeta(dateRange);

  const activityOverTimeConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: stats?.last24Hours.map((item) => item.label) || [],
        datasets: [
          {
            label: "Activities",
            data: last24Values,
            backgroundColor: "#5b6ff0",
            borderColor: "#4338ca",
            borderWidth: 1,
            borderRadius: 4,
            maxBarThickness: 42,
          },
        ],
      },
      options: {
        ...cartesianChartOptions,
        plugins: {
          ...cartesianChartOptions.plugins,
          legend: {
            display: false,
          },
        },
      },
    }),
    [last24Values, stats]
  );

  const actionDistributionConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "doughnut",
      data: {
        labels: topActions.map((item) => formatActionLabel(item.label)),
        datasets: [
          {
            data: topActions.map((item) => item.value),
            backgroundColor: CHART_COLORS,
            borderColor: "#ffffff",
            borderWidth: 3,
          },
        ],
      },
      options: {
        ...chartBaseOptions,
        cutout: "62%",
      },
    }),
    [topActions]
  );

  const topPagesConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: topPages.map((item) => item.label),
        datasets: [
          {
            label: "Views",
            data: topPages.map((item) => item.value),
            backgroundColor: "#13a8a1",
            borderColor: "#0f766e",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        ...cartesianChartOptions,
        indexAxis: "y",
        plugins: {
          ...cartesianChartOptions.plugins,
          legend: {
            display: false,
          },
        },
      },
    }),
    [topPages]
  );

  const locationsConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: topLocations.map((item) => item.label),
        datasets: [
          {
            label: "Activities",
            data: topLocations.map((item) => item.value),
            backgroundColor: "#f59f00",
            borderColor: "#b7791f",
            borderWidth: 1,
            borderRadius: 4,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        ...cartesianChartOptions,
        plugins: {
          ...cartesianChartOptions.plugins,
          legend: {
            display: false,
          },
        },
      },
    }),
    [topLocations]
  );

  const countryConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "doughnut",
      data: {
        labels: topCountries.map((item) => item.label),
        datasets: [
          {
            data: topCountries.map((item) => item.value),
            backgroundColor: CHART_COLORS.slice().reverse(),
            borderColor: "#ffffff",
            borderWidth: 3,
          },
        ],
      },
      options: {
        ...chartBaseOptions,
        cutout: "58%",
      },
    }),
    [topCountries]
  );

  const deviceConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: topDevices.map((item) => item.label),
        datasets: [
          {
            label: "Activities",
            data: topDevices.map((item) => item.value),
            backgroundColor: ["#4f6df5", "#13a8a1", "#f59f00", "#ef476f"],
            borderRadius: 4,
            maxBarThickness: 52,
          },
        ],
      },
      options: {
        ...cartesianChartOptions,
        plugins: {
          ...cartesianChartOptions.plugins,
          legend: {
            display: false,
          },
        },
      },
    }),
    [topDevices]
  );

  const browserConfig = useMemo<ChartConfiguration>(
    () => ({
      type: "bar",
      data: {
        labels: topBrowsers.map((item) => item.label),
        datasets: [
          {
            label: "Activities",
            data: topBrowsers.map((item) => item.value),
            backgroundColor: "#ef476f",
            borderColor: "#be123c",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        ...cartesianChartOptions,
        indexAxis: "y",
        plugins: {
          ...cartesianChartOptions.plugins,
          legend: {
            display: false,
          },
        },
      },
    }),
    [topBrowsers]
  );

  const renderChart = (
    title: string,
    config: ChartConfiguration,
    values: number[],
    height = 300,
    meta?: string,
    className?: string
  ) => (
    <div className={`${styles.chartContainer} ${className || ""}`}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>{title}</h3>
          {meta ? <p>{meta}</p> : null}
        </div>
      </div>
      {hasAnyData(values) ? (
        <ChartCanvas config={config} height={height} />
      ) : (
        <div className={styles.emptyChart}>No data for this period</div>
      )}
    </div>
  );

  const getGroupIpAddress = (group: ActivityGroup) =>
    group.activities.find((activity) => getStringValue(activity.ipAddress))
      ?.ipAddress ||
    group.ipAddress ||
    "-";

  const getGroupPrimaryLabel = (group: ActivityGroup) => {
    if (group.grouping === "ip") {
      return "anonymous";
    }

    return group.label;
  };

  const toggleExpandedGroup = (groupKey: string) => {
    setExpandedGroups((previous) => ({
      ...previous,
      [groupKey]: !previous[groupKey],
    }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading activity data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button
          onClick={() => setSubscriptionAttempt((previous) => previous + 1)}
          className={styles.retryBtn}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div>
          <h1>Activity History Dashboard</h1>
          <p className={styles.subtitle}>
            Live activity analytics from Firebase Realtime Database
          </p>
        </div>
        <div className={styles.headerMeta}>
          <span>Realtime</span>
          <strong>{formatRelativeTime(stats?.lastActivityAt)}</strong>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.dateRange}>
          <label>Time Period</label>
          <div className={styles.buttonGroup}>
            {(["today", "week", "month", "all"] as DateRangeKey[]).map((range) => (
              <button
                type="button"
                key={range}
                className={`${styles.rangeBtn} ${
                  dateRange === range ? styles.active : ""
                }`}
                aria-pressed={dateRange === range}
                onClick={() => {
                  setDateRange(range);
                  setPage(0);
                }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.liveSummary}>
          <span>{dateRangeMeta.label}</span>
          <span>{filteredActivities.length} visible activities</span>
          <span>{allActivities.length} records loaded</span>
        </div>
      </div>

      {stats && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>USR</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Active Users</div>
                <div className={styles.statValue}>{stats.activeUsers}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>ACT</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Activities</div>
                <div className={styles.statValue}>{stats.totalActivities}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>PV</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Page Views</div>
                <div className={styles.statValue}>{stats.pageViews}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>SES</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Sessions</div>
                <div className={styles.statValue}>{stats.uniqueSessions}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>LOG</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Logins</div>
                <div className={styles.statValue}>{stats.logins}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>DL</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Downloads</div>
                <div className={styles.statValue}>{stats.downloads}</div>
              </div>
            </div>
          </div>

          <div className={styles.insightStrip}>
            <div>
              <span>Top action</span>
              <strong>{topAction === "-" ? "-" : formatActionLabel(topAction)}</strong>
            </div>
            <div>
              <span>Top page</span>
              <strong>{topPage}</strong>
            </div>
            <div>
              <span>Top location</span>
              <strong>{topLocation}</strong>
            </div>
            <div>
              <span>Blocked downloads</span>
              <strong>{stats.blockedDownloads}</strong>
            </div>
            <div>
              <span>Signups</span>
              <strong>{stats.signups}</strong>
            </div>
          </div>
        </>
      )}

      <div className={styles.tabNav}>
        <button
          className={`${styles.tab} ${
            activeTab === "overview" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "analytics" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "activities" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("activities")}
        >
          Activity Log
        </button>
      </div>

      {activeTab === "overview" && stats && (
        <div className={styles.tabContent}>
          {renderChart(
            "Activity Over Time (24h)",
            activityOverTimeConfig,
            last24Values,
            300,
            "Hourly events from the selected realtime dataset",
            styles.chartWide
          )}
          <div className={styles.chartsRow}>
            {renderChart(
              "Action Distribution",
              actionDistributionConfig,
              topActions.map((item) => item.value),
              280,
              "Login, page access, download, and signup mix"
            )}
            {renderChart(
              "Top Pages",
              topPagesConfig,
              topPages.map((item) => item.value),
              280,
              "Most viewed pages in this period"
            )}
          </div>
          <div className={styles.recentPanel}>
            <div className={styles.recentPanelHeader}>
              <h3>Latest Events</h3>
              <span>{formatTimestamp(stats.lastActivityAt)}</span>
            </div>
            <div className={styles.recentList}>
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.recentItem}>
                    <div>
                      <strong>{activity.action}</strong>
                      <span>{getActivityDetailText(activity)}</span>
                    </div>
                    <time>{formatTimestamp(activity.timestamp)}</time>
                  </div>
                ))
              ) : (
                <div className={styles.noData}>No activities found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && stats && (
        <div className={styles.tabContent}>
          <div className={styles.chartsRow}>
            {renderChart(
              "Location Activity",
              locationsConfig,
              topLocations.map((item) => item.value),
              300,
              "Cities or regions captured from visitor IP metadata"
            )}
            {renderChart(
              "Country Share",
              countryConfig,
              topCountries.map((item) => item.value),
              300,
              "Country-level activity distribution"
            )}
          </div>
          <div className={styles.chartsRow}>
            {renderChart(
              "Device Type",
              deviceConfig,
              topDevices.map((item) => item.value),
              280,
              "Desktop, mobile, tablet, or unknown"
            )}
            {renderChart(
              "Browser Usage",
              browserConfig,
              topBrowsers.map((item) => item.value),
              280,
              "Detected from the stored user agent"
            )}
          </div>
        </div>
      )}

      {activeTab === "activities" && (
        <div className={styles.tabContent}>
          <div className={styles.filterSection}>
            <input
              type="text"
              placeholder="Search by email, IP, action, page, city, or country..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(0);
              }}
              className={styles.searchInput}
            />
            <select
              value={filterAction}
              onChange={(event) => {
                setFilterAction(event.target.value);
                setPage(0);
              }}
              className={styles.selectInput}
            >
              <option value="">All Actions</option>
              {stats &&
                Object.keys(stats.byAction).map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.activityLogList}>
            {paginatedGroups.length > 0 ? (
              paginatedGroups.map((group) => {
                const groupIp = getGroupIpAddress(group);
                const isExpanded = Boolean(expandedGroups[group.key]);
                const visibleActivities = isExpanded
                  ? group.activities
                  : group.activities.slice(0, COMPACT_GROUP_ACTIVITY_ROWS);
                const hiddenActivityCount =
                  group.activities.length - visibleActivities.length;

                return (
                  <section key={group.key} className={styles.activityLogCard}>
                    <div className={styles.activityLogHeader}>
                      <span className={styles.activityLogAvatar} aria-hidden="true" />
                      <div>
                        <h3>
                          {getGroupPrimaryLabel(group)} <span>/ {groupIp}</span>
                        </h3>
                        <p>
                          Showing {visibleActivities.length} of{" "}
                          {group.activities.length} activities, latest{" "}
                          {formatRelativeTime(group.activities[0]?.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className={styles.activityLogTableWrap}>
                      <table className={styles.activityLogTable}>
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleActivities.map((activity) => (
                            <tr key={activity.id}>
                              <td>{formatTimestamp(activity.timestamp)}</td>
                              <td>{activity.action}</td>
                              <td>{getActivityDetailText(activity)}</td>
                              <td>{getActivityLocation(activity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {group.activities.length > COMPACT_GROUP_ACTIVITY_ROWS ? (
                      <div className={styles.activityLogFooter}>
                        <button
                          type="button"
                          onClick={() => toggleExpandedGroup(group.key)}
                          className={styles.compactToggleBtn}
                        >
                          {isExpanded
                            ? "Show less"
                            : `Show ${hiddenActivityCount} more`}
                        </button>
                      </div>
                    ) : null}
                  </section>
                );
              })
            ) : (
              <div className={styles.emptyActivityLog}>No activities found</div>
            )}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className={styles.paginationBtn}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {Math.min(page + 1, totalPages)} of {totalPages} |{" "}
              {groupedActivities.length} groups / {filteredActivities.length}{" "}
              activities
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className={styles.paginationBtn}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
