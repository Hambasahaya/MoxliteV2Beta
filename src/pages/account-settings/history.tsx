import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSnackbar } from "notistack";
import ProtectedRoute from "@/lib/protectedRoute";
import { useAuth } from "@/lib/authContext";
import {
  ActivityHistoryService,
  type ActivityHistory,
} from "@/lib/activityHistoryService";

type SectionKey =
  | "personal-details"
  | "historical-log"
  | "request-data"
  | "newsletter"
  | "change-password"
  | "delete-account";

type HistoryAction = {
  id: string;
  title: string;
  time: string;
  description: string;
};

type HistoryGroup = {
  date: string;
  actions: HistoryAction[];
};

const sections: Array<{ key: SectionKey; label: string; href?: string }> = [
  { key: "personal-details", label: "Personal details", href: "/account-settings" },
  { key: "historical-log", label: "Historical log", href: "/account-settings/history" },
  { key: "request-data", label: "Request data" },
  { key: "newsletter", label: "Newsletter" },
  { key: "change-password", label: "Change Password" },
  { key: "delete-account", label: "Delete account" },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
});

const actionLabels: Record<string, string> = {
  page_access: "Page access",
  download: "File download",
  download_blocked: "Download blocked",
  login: "Login",
  logout: "Logout",
  signup: "Sign up",
  login_failed: "Login failed",
  password_reset_requested: "Password reset requested",
  signup_provider_unavailable: "Sign up provider unavailable",
};

const asString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toTitleCase = (value: string) =>
  value.replace(/\b\w/g, (character) => character.toUpperCase());

const humanizeAction = (action: string) =>
  actionLabels[action] || toTitleCase(action.replace(/[_-]+/g, " "));

const formatPagePath = (value?: string) => {
  if (!value) {
    return undefined;
  }

  let path = value;
  try {
    path = new URL(value, "https://moxlite.com").pathname;
  } catch {
    path = value.split("?")[0];
  }

  const cleanedPath = path.split("?")[0].replace(/^\/+|\/+$/g, "");
  if (!cleanedPath) {
    return "Homepage";
  }

  return toTitleCase(cleanedPath.replace(/[-_]/g, " ").replace(/\//g, " / "));
};

const getActivityDisplay = (activity: ActivityHistory): HistoryAction => {
  const details = activity.actionDetails || {};
  const page = formatPagePath(
    asString(details.page) || asString(details.currentPath)
  );
  const fileName = asString(details.fileName);
  const documentType = asString(details.documentType);
  const productName = asString(details.productName);
  const providerId = asString(details.providerId);
  const timestamp = new Date(activity.timestamp || Date.now());

  switch (activity.action) {
    case "page_access":
      return {
        id: activity.id,
        title: page ? `Visited ${page}` : "Page access",
        time: timeFormatter.format(timestamp),
        description: page ? `Opened ${page}.` : "Opened a page.",
      };
    case "download":
      return {
        id: activity.id,
        title: fileName ? `Downloaded ${fileName}` : "File download",
        time: timeFormatter.format(timestamp),
        description: `${documentType || "Document"} downloaded${
          productName ? ` for ${productName}` : ""
        }.`,
      };
    case "download_blocked":
      return {
        id: activity.id,
        title: fileName ? `Tried downloading ${fileName}` : "Download blocked",
        time: timeFormatter.format(timestamp),
        description: "The download was blocked because login was required.",
      };
    case "login":
      return {
        id: activity.id,
        title: "Login",
        time: timeFormatter.format(timestamp),
        description: `Signed in${providerId ? ` using ${providerId}` : ""}.`,
      };
    case "logout":
      return {
        id: activity.id,
        title: "Logout",
        time: timeFormatter.format(timestamp),
        description: "Signed out from your account.",
      };
    case "signup":
      return {
        id: activity.id,
        title: "Account created",
        time: timeFormatter.format(timestamp),
        description: `Created account${providerId ? ` using ${providerId}` : ""}.`,
      };
    case "password_reset_requested":
      return {
        id: activity.id,
        title: "Password reset requested",
        time: timeFormatter.format(timestamp),
        description: "Requested a password reset email.",
      };
    default:
      return {
        id: activity.id,
        title: humanizeAction(activity.action),
        time: timeFormatter.format(timestamp),
        description: page ? `Activity recorded on ${page}.` : "Activity recorded.",
      };
  }
};

const groupActivitiesByDate = (
  activities: ActivityHistory[]
): HistoryGroup[] => {
  const groups = new Map<string, HistoryAction[]>();

  activities.forEach((activity) => {
    const timestamp = new Date(activity.timestamp || Date.now());
    const date = dateFormatter.format(timestamp);
    const actions = groups.get(date) || [];
    actions.push(getActivityDisplay(activity));
    groups.set(date, actions);
  });

  return Array.from(groups.entries()).map(([date, actions]) => ({
    date,
    actions,
  }));
};

const AccountSettingsHistoryPage: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setActivities([]);
      setIsLoadingHistory(false);
      return;
    }

    setIsLoadingHistory(true);
    setHistoryError(null);

    const unsubscribe = ActivityHistoryService.onUserActivitiesChange(
      user.uid,
      (nextActivities) => {
        setActivities(nextActivities);
        setIsLoadingHistory(false);
      },
      () => {
        setActivities([]);
        setHistoryError("We couldn't load your activity history right now.");
        setIsLoadingHistory(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const historyGroups = useMemo(
    () => groupActivitiesByDate(activities),
    [activities]
  );

  const handleSectionClick = () => {
    enqueueSnackbar("Section coming soon!", { variant: "info" });
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Historical Log - Moxlite</title>
        <meta name="description" content="View your Moxlite account history" />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main className="min-h-screen bg-white text-[#05070f]">
        <header className="flex h-[72px] items-center justify-center bg-black px-6">
          <h1 className="text-center text-[26px] font-bold leading-none text-white sm:text-[30px]">
            Dashboard Profile
          </h1>
        </header>

        <section className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-14 sm:px-10 lg:pt-[56px]">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111319] transition hover:text-[#535b68]"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to Moxlite Dashboard Home</span>
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
            <aside>
              <h2 className="text-[34px] font-bold leading-tight text-black">
                Account Settings
              </h2>

              <nav className="mt-10 space-y-1">
                {sections.map((section) => {
                  const isActive = section.key === "historical-log";
                  const className = `block w-full text-left text-[14px] leading-tight transition ${
                    isActive
                      ? "font-semibold text-[#111319]"
                      : "py-2 text-[#222933] hover:text-[#69717e]"
                  }`;

                  if (section.href) {
                    return (
                      <Link key={section.key} href={section.href} className={className}>
                        {section.label}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={handleSectionClick}
                      className={className}
                    >
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <section className="max-w-[660px] pt-20 lg:pt-[82px]">
              <h3 className="text-[22px] font-bold leading-tight text-black">
                History
              </h3>

              <div className="relative mt-5 pl-9">
                <div className="absolute left-[9px] top-4 h-[calc(100%-14px)] w-px bg-[#e4e7ec]" />

                {isLoadingHistory && (
                  <div className="rounded-[2px] border border-[#e2e6eb] bg-white px-4 py-5 text-[12px] text-[#626b78]">
                    Loading your history...
                  </div>
                )}

                {!isLoadingHistory && historyError && (
                  <div className="rounded-[2px] border border-[#f1c6c6] bg-[#fff7f7] px-4 py-5 text-[12px] text-[#8a3030]">
                    {historyError}
                  </div>
                )}

                {!isLoadingHistory && !historyError && historyGroups.length === 0 && (
                  <div className="rounded-[2px] border border-[#e2e6eb] bg-white px-4 py-5 text-[12px] leading-relaxed text-[#626b78]">
                    No activity history yet.
                  </div>
                )}

                {!isLoadingHistory && !historyError && historyGroups.length > 0 && (
                  <div className="space-y-16">
                  {historyGroups.map((group, groupIndex) => (
                    <div key={`${group.date}-${groupIndex}`} className="relative">
                      <span className="absolute -left-[33px] top-[5px] h-2 w-2 rounded-full bg-[#45a39d]" />
                      <p className="text-[11px] font-semibold leading-tight text-[#5f6875]">
                        {group.date}
                      </p>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {group.actions.map((action, actionIndex) => (
                          <article
                            key={`${action.id}-${actionIndex}`}
                            className="min-h-[58px] rounded-[2px] border border-[#e2e6eb] bg-white px-3 py-2"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-[12px] font-semibold leading-tight text-[#252b34]">
                                {action.title}
                              </h4>
                              <time className="shrink-0 text-[10px] leading-tight text-[#626b78]">
                                {action.time}
                              </time>
                            </div>
                            <p className="mt-2 text-[11px] leading-tight text-[#6b7280]">
                              {action.description}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default AccountSettingsHistoryPage;
