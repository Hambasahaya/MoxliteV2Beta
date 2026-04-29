import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSnackbar } from "notistack";
import ProtectedRoute from "@/lib/protectedRoute";

type SettingsForm = {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  landline: string;
  mobile: string;
  street: string;
  postcode: string;
  town: string;
  country: string;
};

type SectionKey =
  | "personal-details"
  | "historical-log"
  | "request-data"
  | "newsletter"
  | "change-password"
  | "delete-account";

const sections: Array<{ key: SectionKey; label: string; href?: string }> = [
  { key: "personal-details", label: "Personal details", href: "/account-settings" },
  { key: "historical-log", label: "Historical log", href: "/account-settings/history" },
  { key: "request-data", label: "Request data" },
  { key: "newsletter", label: "Newsletter" },
  { key: "change-password", label: "Change Password" },
  { key: "delete-account", label: "Delete account" },
];

const initialForm: SettingsForm = {
  salutation: "",
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  position: "",
  landline: "",
  mobile: "",
  street: "",
  postcode: "",
  town: "",
  country: "",
};

const fieldClassName =
  "h-9 w-full rounded-[4px] border border-[#dfe4ea] bg-white px-3 text-[12px] text-[#111319] outline-none transition placeholder:text-[#a0a7b2] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10";

const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) => (
  <label htmlFor={htmlFor} className="mb-2 block text-[11px] font-medium text-[#111319]">
    {children}
  </label>
);

const AccountSettingsPage: NextPage = () => {
  const [form, setForm] = useState<SettingsForm>(initialForm);
  const { enqueueSnackbar } = useSnackbar();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSectionClick = () => {
    enqueueSnackbar("Section coming soon!", { variant: "info" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enqueueSnackbar("Account settings saved locally.", { variant: "success" });
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Account Settings - Moxlite</title>
        <meta name="description" content="Manage your Moxlite account settings" />
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

          <div className="mt-10 grid gap-10 lg:grid-cols-[150px_minmax(0,1fr)] lg:gap-16">
            <aside>
              <h2 className="text-[34px] font-bold leading-tight text-black">
                Account Settings
              </h2>

              <nav className="mt-10 space-y-1">
                {sections.map((section) => {
                  const isActive = section.key === "personal-details";
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

            <div className="max-w-[700px]">
              <h3 className="text-[32px] font-bold leading-tight text-black">
                Personal Information
              </h3>
              <p className="mt-4 max-w-[560px] text-[13px] leading-[1.85] text-[#222933]">
                Need to change your details? Here you can update your account profile.
                For name and email changes, please{" "}
                <Link href="/contact" className="font-semibold text-[#111319] underline">
                  get in touch!
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <Label htmlFor="salutation">Salutation</Label>
                  <input
                    id="salutation"
                    name="salutation"
                    type="text"
                    placeholder="example"
                    value={form.salutation}
                    onChange={handleInputChange}
                    className={fieldClassName}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="example"
                      value={form.firstName}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="example"
                      value={form.lastName}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example"
                    value={form.email}
                    onChange={handleInputChange}
                    className={fieldClassName}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="example"
                      value={form.company}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      placeholder="example"
                      value={form.position}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="landline">Landline number incl. country prefix</Label>
                    <input
                      id="landline"
                      name="landline"
                      type="text"
                      placeholder="example"
                      value={form.landline}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile number incl. country prefix</Label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="text"
                      placeholder="example"
                      value={form.mobile}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  <div>
                    <Label htmlFor="street">Street</Label>
                    <input
                      id="street"
                      name="street"
                      type="text"
                      placeholder="example"
                      value={form.street}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <input
                      id="postcode"
                      name="postcode"
                      type="text"
                      placeholder="example"
                      value={form.postcode}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <Label htmlFor="town">Town</Label>
                    <input
                      id="town"
                      name="town"
                      type="text"
                      placeholder="example"
                      value={form.town}
                      onChange={handleInputChange}
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div className="max-w-[400px]">
                  <Label htmlFor="country">Country (please select)</Label>
                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleInputChange}
                    className={fieldClassName}
                  >
                    <option value="">example</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-2 h-9 w-full max-w-[182px] rounded-[4px] bg-[#1f1f21] text-[12px] font-medium text-white transition hover:bg-[#343437]"
                >
                  Save Change
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default AccountSettingsPage;
