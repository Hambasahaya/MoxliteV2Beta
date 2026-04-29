import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSnackbar } from "notistack";
import ProtectedRoute from "@/lib/protectedRoute";

type SectionKey =
  | "personal-details"
  | "historical-log"
  | "request-data"
  | "newsletter"
  | "change-password"
  | "delete-account";

type HistoryAction = {
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

const historyGroups: HistoryGroup[] = [
  {
    date: "Thursday, 16 April 2026",
    actions: [
      {
        title: "Change password",
        time: "10:36 AM",
        description: "You have been changed your password.",
      },
      {
        title: "Change profile",
        time: "09:00 AM",
        description: "You have been changed your profile.",
      },
    ],
  },
  {
    date: "Wednesday, 15 April 2026",
    actions: [
      {
        title: "Change password",
        time: "10:36 AM",
        description: "You have been changed your password.",
      },
    ],
  },
  {
    date: "Tuesday, 14 April 2026",
    actions: [
      {
        title: "Change password",
        time: "10:36 AM",
        description: "You have been changed your password.",
      },
      {
        title: "Change profile",
        time: "09:00 AM",
        description: "You have been changed your profile.",
      },
    ],
  },
  {
    date: "Tuesday, 14 April 2026",
    actions: [
      {
        title: "Change password",
        time: "10:36 AM",
        description: "You have been changed your password.",
      },
      {
        title: "Change profile",
        time: "09:00 AM",
        description: "You have been changed your profile.",
      },
      {
        title: "Change password",
        time: "10:36 AM",
        description: "You have been changed your password.",
      },
    ],
  },
];

const AccountSettingsHistoryPage: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();

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
                            key={`${action.title}-${action.time}-${actionIndex}`}
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
              </div>
            </section>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default AccountSettingsHistoryPage;
