import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { updateProfile } from "firebase/auth";
import { get, ref, update } from "firebase/database";
import ProtectedRoute from "@/lib/protectedRoute";
import { useAuth } from "@/lib/authContext";
import { rtdb } from "@/lib/firebase";

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

const profileFields: Array<keyof SettingsForm> = [
  "salutation",
  "firstName",
  "lastName",
  "email",
  "company",
  "position",
  "landline",
  "mobile",
  "street",
  "postcode",
  "town",
  "country",
];

const fieldClassName =
  "h-9 w-full rounded-[4px] border border-[#dfe4ea] bg-white px-3 text-[12px] text-[#111319] outline-none transition placeholder:text-[#a0a7b2] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10";

const splitDisplayName = (displayName?: string | null) => {
  const parts = (displayName || "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const getProfileFormValues = (profile: unknown): Partial<SettingsForm> => {
  if (!profile || typeof profile !== "object") {
    return {};
  }

  return profileFields.reduce<Partial<SettingsForm>>((values, field) => {
    const value = (profile as Partial<Record<keyof SettingsForm, unknown>>)[field];

    if (typeof value === "string") {
      values[field] = value;
    }

    return values;
  }, {});
};

const trimFormValues = (form: SettingsForm): SettingsForm =>
  profileFields.reduce<SettingsForm>(
    (values, field) => ({
      ...values,
      [field]: form[field].trim(),
    }),
    initialForm
  );

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
  const [isSaving, setIsSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setForm(initialForm);
      return () => {
        isMounted = false;
      };
    }

    const { firstName, lastName } = splitDisplayName(user.displayName);

    const authFormValues: Partial<SettingsForm> = {
      firstName,
      lastName,
      email: user.email || "",
    };

    setForm((prev) => ({
      ...prev,
      ...authFormValues,
    }));

    const loadProfile = async () => {
      try {
        const profileSnapshot = await get(ref(rtdb, `users/${user.uid}/profile`));

        if (!isMounted || !profileSnapshot.exists()) {
          return;
        }

        setForm((prev) => ({
          ...prev,
          ...getProfileFormValues(profileSnapshot.val()),
        }));
      } catch (error) {
        console.error("Failed to load account profile:", error);
        enqueueSnackbar("Failed to load saved profile details.", {
          variant: "warning",
        });
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [enqueueSnackbar, user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      enqueueSnackbar("Please log in before saving your profile.", {
        variant: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      const profile = trimFormValues(form);
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();

      await update(ref(rtdb, `users/${user.uid}/profile`), {
        ...profile,
        uid: user.uid,
        updatedAt: Date.now(),
      });

      if (fullName && fullName !== user.displayName) {
        await updateProfile(user, { displayName: fullName });
      }

      setForm(profile);
      enqueueSnackbar("Account settings saved.", { variant: "success" });
    } catch (error) {
      console.error("Failed to save account profile:", error);
      enqueueSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to save account settings.",
        { variant: "error" }
      );
    } finally {
      setIsSaving(false);
    }
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
                  disabled={isSaving}
                  className="mt-2 h-9 w-full max-w-[182px] rounded-[4px] bg-[#1f1f21] text-[12px] font-medium text-white transition hover:bg-[#343437] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Change"}
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
