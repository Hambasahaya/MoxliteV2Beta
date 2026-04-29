import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { activityTracker } from "@/lib/activityTracker";
import { getSafeRedirect } from "@/lib/redirect";

const GithubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.48 2 2 6.59 2 12.25c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.39 9.39 0 0 1 12 6.98c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z"
      clipRule="evenodd"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.6 12.23c0-.73-.07-1.43-.19-2.11H12v3.99h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.41Z" />
    <path d="M12 22c2.7 0 4.96-.89 6.62-2.36l-3.24-2.51c-.9.6-2.05.95-3.38.95-2.6 0-4.8-1.75-5.59-4.11H3.06v2.59A9.99 9.99 0 0 0 12 22Z" />
    <path d="M6.41 13.97A6 6 0 0 1 6.09 12c0-.68.12-1.34.32-1.97V7.44H3.06A9.99 9.99 0 0 0 2 12c0 1.61.38 3.14 1.06 4.56l3.35-2.59Z" />
    <path d="M12 5.92c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.59 9.59 0 0 0 12 2a9.99 9.99 0 0 0-8.94 5.44l3.35 2.59C7.21 7.67 9.4 5.92 12 5.92Z" />
  </svg>
);

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const redirect = getSafeRedirect(router.query.redirect, "/dashboard");
  const loginHref =
    redirect !== "/dashboard"
      ? `/auth/login?redirect=${encodeURIComponent(redirect)}`
      : "/auth/login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordError("");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (!isFirebaseConfigured) {
      enqueueSnackbar("Firebase auth is not configured yet.", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (fullName) {
        await updateProfile(result.user, { displayName: fullName });
      }

      await activityTracker.trackSignup(result.user, {
        providerId: "password",
        fullName,
      });
      await activityTracker.trackLogin(result.user);

      enqueueSnackbar("Account created successfully!", { variant: "success" });
      router.push(redirect);
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Signup failed. Please try again.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!isFirebaseConfigured) {
      enqueueSnackbar("Firebase auth is not configured yet.", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userInfo = getAdditionalUserInfo(result);

      if (userInfo?.isNewUser) {
        await activityTracker.trackSignup(result.user, {
          providerId: "google.com",
        });
      }

      await activityTracker.trackLogin(result.user);

      enqueueSnackbar("Account created successfully!", { variant: "success" });
      router.push(redirect);
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Google signup failed.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    await activityTracker.trackActivity(null, "signup_provider_unavailable", {
      providerId: "github.com",
    });
    enqueueSnackbar("Github signup coming soon!", { variant: "info" });
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-[#1c1c1f] sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1360px] overflow-hidden rounded-[2px] border border-[#d7dce3] bg-white lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden min-h-[700px] bg-[#020714] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(47,119,119,0.82),transparent_34%),linear-gradient(135deg,#020714_0%,#030716_68%,#020714_100%)]" />
          <div className="relative px-10 py-10">
            <img src="/icon/moxlite-icon-1.svg" className="h-[28px] w-auto" alt="Moxlite" />
          </div>

          <div className="relative px-10 pb-10">
            <div className="mb-10 flex items-end gap-14">
              <h1 className="max-w-[300px] text-[40px] font-bold leading-[0.95] text-white">
                Get Started
                <br />
                with Us
              </h1>
              <p className="max-w-[250px] pb-2 text-[15px] leading-tight text-white">
                Complete these easy steps to register to your account.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex min-h-[150px] flex-col justify-between rounded-[8px] bg-white p-7 text-[#1c1c1f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1f1f21] text-[12px] font-bold text-white">
                  1
                </span>
                <p className="text-[15px] font-bold leading-tight">
                  Sign up your
                  <br />
                  account
                </p>
              </div>

              <div className="flex min-h-[150px] flex-col justify-between rounded-[8px] bg-[#4a5566] p-7 text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#718096] text-[12px] font-bold text-white">
                  2
                </span>
                <p className="text-[15px] font-bold leading-tight">
                  Set up your
                  <br />
                  profile
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex min-h-[700px] items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <Link
            href={loginHref}
            className="absolute right-8 top-8 text-[13px] font-medium text-[#1c1c1f] transition hover:text-[#5a6472]"
          >
            Login
          </Link>

          <div className="w-full max-w-[360px]">
            <div className="mb-8 text-center">
              <div className="mb-8 flex justify-center lg:hidden">
                <img src="/icon/moxlite-icon-1.svg" className="h-[20px] w-auto invert" alt="Moxlite" />
              </div>
              <h1 className="text-[28px] font-bold leading-tight text-[#1c1c1f]">
                Create an account
              </h1>
              <p className="mt-2 text-[13px] text-[#7d828c]">
                Enter your email below to create your account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGithubSignup}
                className="flex h-9 items-center justify-center gap-2 rounded-[5px] border border-[#d8dde5] bg-white text-[13px] font-medium text-[#1c1c1f] transition hover:bg-[#f7f8fa]"
              >
                <GithubIcon />
                <span>Github</span>
              </button>
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="flex h-9 items-center justify-center gap-2 rounded-[5px] border border-[#d8dde5] bg-white text-[13px] font-medium text-[#1c1c1f] transition hover:bg-[#f7f8fa]"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e3e6eb]" />
              <span className="text-[12px] text-[#8c929c]">Or</span>
              <div className="h-px flex-1 bg-[#e3e6eb]" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-[#1c1c1f]">
                    First Name
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="eg. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-[5px] border border-[#d8dde5] px-3 text-[13px] outline-none transition placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-[#1c1c1f]">
                    Last Name
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="eg. Francisco"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-[5px] border border-[#d8dde5] px-3 text-[13px] outline-none transition placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-[#1c1c1f]">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10 w-full rounded-[5px] border border-[#d8dde5] px-3 text-[13px] outline-none transition placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-[#1c1c1f]">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-10 w-full rounded-[5px] border border-[#d8dde5] px-3 text-[13px] outline-none transition placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10"
                />
              </label>

              {passwordError && (
                <p className="rounded-[5px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-[5px] bg-[#1f1f21] text-[13px] font-medium text-white transition hover:bg-[#343437] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
