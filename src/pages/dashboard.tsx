import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ProtectedRoute from "@/lib/protectedRoute";
import { useAuth } from "@/lib/authContext";

type DashboardAction = {
  title: string;
  description: string;
  href: string;
  tone: "dark" | "teal";
  icon: React.ReactNode;
};

const CatalogIcon = () => (
  <svg className="h-8 w-8 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M15.5 4 6 9.4v11.2L16.5 26 26 20.6V9.4L16.5 4H15.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="m6.5 9.5 9.9 5.5 9.1-5.4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16.5 15v10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M21 18.2 27 15v4.7l-6 3.3v-4.8Z" fill="currentColor" />
  </svg>
);

const SoftwareIcon = () => (
  <svg className="h-8 w-8 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="6" y="4.5" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M16 9v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="m11.8 15.8 4.2 4.2 4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 24h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SupportIcon = () => (
  <svg className="h-8 w-8 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M5 7.5h14.5a2.5 2.5 0 0 1 2.5 2.5v7.5a2.5 2.5 0 0 1-2.5 2.5H13l-5 4v-4H5a2.5 2.5 0 0 1-2.5-2.5V10A2.5 2.5 0 0 1 5 7.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M22 13h2.5A2.5 2.5 0 0 1 27 15.5V27l-5-4h-4.5A2.5 2.5 0 0 1 15 20.5V20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const AccountIcon = () => (
  <svg className="h-8 w-8 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M4.5 24c1.2-4.4 4-7 7.5-7 2.3 0 4.3 1.1 5.7 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M23 17.5v2.1M23 25.4v2.1M18.9 19.9l1.8 1M25.3 24l1.8 1M27.1 19.9l-1.8 1M20.7 24l-1.8 1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const actions: DashboardAction[] = [
  {
    title: "Catalog",
    description: "Explore Moxlite Partners for sales, rental, service and solutions",
    href: "/product",
    tone: "dark",
    icon: <CatalogIcon />,
  },
  {
    title: "Software",
    description: "Find your recent downloads and available updates",
    href: "/dashboard#software",
    tone: "dark",
    icon: <SoftwareIcon />,
  },
  {
    title: "Support",
    description: "Looking for help or information? Get in touch!",
    href: "/contact",
    tone: "dark",
    icon: <SupportIcon />,
  },
  {
    title: "Account Settings",
    description: "Manage your account settings here",
    href: "/account-settings",
    tone: "teal",
    icon: <AccountIcon />,
  },
];

const DashboardPage: NextPage = () => {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Moxliter";

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard Profile - Moxlite</title>
        <meta name="description" content="Moxlite user dashboard profile" />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main className="min-h-screen bg-white text-[#05070f]">
        <header className="flex h-[72px] items-center justify-center bg-black px-6">
          <h1 className="text-center text-[26px] font-bold leading-none text-white sm:text-[30px]">
            Dashboard Profile
          </h1>
        </header>

        <section className="mx-auto w-full max-w-[1100px] px-6 pb-16 pt-16 sm:px-10 lg:px-0 lg:pt-[86px]">
          <div className="max-w-[560px]">
            <h2 className="text-[30px] font-bold leading-tight text-black sm:text-[34px]">
              {displayName}.
            </h2>
            <p className="mt-2 text-[20px] leading-tight text-black sm:text-[22px]">
              Welcome Moxliter!
            </p>

            <div className="mt-7 space-y-7 text-[13px] leading-[1.75] text-black sm:text-[14px]">
              <p>
                Everything you need, all in one place - from past events and upcoming
                trainings to software downloads and real-time updates.
              </p>
              <p>
                Moxliter is built to streamline your experience, keeping you informed, in
                control, and fully connected to the Moxlite ecosystem.
              </p>
            </div>
          </div>

          <h3 className="mt-12 text-[17px] font-bold leading-tight text-black sm:text-[19px]">
            Thank you for being part of the Moxlite Community!
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`flex min-h-[114px] items-center gap-5 rounded-[8px] px-6 py-5 text-white transition hover:-translate-y-0.5 hover:shadow-lg ${
                  action.tone === "teal" ? "bg-[#45a39d]" : "bg-[#020616]"
                }`}
              >
                {action.icon}
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold leading-tight">
                    {action.title}
                  </span>
                  <span className="mt-2 block text-[10px] leading-tight text-white/90">
                    {action.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default DashboardPage;
