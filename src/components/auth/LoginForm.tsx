import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { activityTracker } from "@/lib/activityTracker";
import { getSafeRedirect } from "@/lib/redirect";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const GoogleIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21.6 12.23c0-.73-.07-1.43-.19-2.11H12v3.99h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.41Z" />
    <path d="M12 22c2.7 0 4.96-.89 6.62-2.36l-3.24-2.51c-.9.6-2.05.95-3.38.95-2.6 0-4.8-1.75-5.59-4.11H3.06v2.59A9.99 9.99 0 0 0 12 22Z" />
    <path d="M6.41 13.97A6 6 0 0 1 6.09 12c0-.68.12-1.34.32-1.97V7.44H3.06A9.99 9.99 0 0 0 2 12c0 1.61.38 3.14 1.06 4.56l3.35-2.59Z" />
    <path d="M12 5.92c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.59 9.59 0 0 0 12 2a9.99 9.99 0 0 0-8.94 5.44l3.35 2.59C7.21 7.67 9.4 5.92 12 5.92Z" />
  </svg>
);

const getAuthErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return "Login failed. Please try again.";
  }

  if (error.message.includes("auth/invalid-credential")) {
    return "Email or password is incorrect.";
  }

  if (error.message.includes("auth/user-disabled")) {
    return "This account has been disabled.";
  }

  return error.message;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const redirect = getSafeRedirect(router.query.redirect, "/dashboard");
  const signupHref =
    redirect !== "/dashboard"
      ? `/auth/signup?redirect=${encodeURIComponent(redirect)}`
      : "/auth/signup";

  const finishLogin = async () => {
    enqueueSnackbar("Login successful!", { variant: "success" });

    if (onLoginSuccess) {
      onLoginSuccess();
      return;
    }

    router.push(redirect);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirebaseConfigured) {
      enqueueSnackbar("Firebase auth is not configured yet.", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await activityTracker.trackLogin(result.user);
      await finishLogin();
    } catch (error) {
      await activityTracker.trackActivity(null, "login_failed", {
        providerId: "password",
        email,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      enqueueSnackbar(getAuthErrorMessage(error), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      enqueueSnackbar("Firebase auth is not configured yet.", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await activityTracker.trackLogin(result.user);
      await finishLogin();
    } catch (error) {
      await activityTracker.trackActivity(null, "login_failed", {
        providerId: "google.com",
        message: error instanceof Error ? error.message : "Unknown error",
      });
      enqueueSnackbar(getAuthErrorMessage(error), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-[#1c1c1f] sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1170px] overflow-hidden rounded-[2px] border border-[#d7dce3] bg-white lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden bg-[#020714] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(47,119,119,0.82),transparent_36%),linear-gradient(135deg,#020714_0%,#030716_68%,#020714_100%)]" />
          <div className="relative px-9 py-9">
            <img
              src="/icon/moxlite-icon-1.svg"
              className="h-[22px] w-auto"
              alt="Moxlite"
            />
          </div>
        </aside>

        <section className="relative flex min-h-[620px] items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <Link
            href={signupHref}
            className="absolute right-8 top-8 text-[11px] font-medium text-[#1c1c1f] transition hover:text-[#5a6472]"
          >
            Sign Up
          </Link>

          <div className="w-full max-w-[310px]">
            <div className="mb-7 text-center">
              <div className="mb-8 flex justify-center lg:hidden">
                <img
                  src="/icon/moxlite-icon-1.svg"
                  className="h-[20px] w-auto invert"
                  alt="Moxlite"
                />
              </div>
              <h1 className="text-[24px] font-bold leading-tight text-[#1c1c1f]">
                Hi, Moxliter!
              </h1>
              <p className="mt-2 text-[12px] text-[#7d828c]">
                Login to your Moxlite account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 w-full rounded-[4px] border border-[#d8dde5] px-3 text-[12px] outline-none transition placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10"
              />

              <input
                type="password"
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 w-full rounded-[4px] border border-[#d8dde5] px-3 text-[12px] outline-none transition placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10"
              />

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-medium text-[#1c1c1f] transition hover:text-[#5a6472]"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-8 w-full rounded-[4px] bg-[#1f1f21] text-[11px] font-medium text-white transition hover:bg-[#343437] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e3e6eb]" />
              <span className="text-[9px] uppercase tracking-[0.06em] text-[#8c929c]">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-[#e3e6eb]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex h-8 w-full items-center justify-center gap-2 rounded-[4px] border border-[#d8dde5] bg-white text-[12px] font-medium text-[#1c1c1f] transition hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GoogleIcon />
              <span>Google</span>
            </button>

            <p className="mx-auto mt-6 max-w-[260px] text-center text-[10px] leading-relaxed text-[#8a9099]">
              Don&apos;t have an account?{" "}
              <Link
                href={signupHref}
                className="font-medium text-[#1c1c1f] transition hover:text-[#5a6472]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
