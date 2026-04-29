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
  const [showPassword, setShowPassword] = useState(false);
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
    <div
      className={`min-h-screen px-5 py-8 text-[#1c1c1f] transition-colors duration-700 sm:px-8 lg:px-10 ${
        showPassword ? "bg-[#020709]" : "bg-white"
      }`}
    >
      <div
        className={`relative mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1170px] overflow-hidden rounded-[2px] border transition duration-700 lg:grid-cols-[1fr_1fr] ${
          showPassword
            ? "border-white/12 bg-[#020709] shadow-[0_34px_110px_rgba(0,0,0,0.68),0_0_80px_rgba(63,223,205,0.2)]"
            : "border-[#d7dce3] bg-white"
        }`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-[42%] z-[3] hidden w-[44%] origin-left transition-all duration-700 lg:block ${
            showPassword ? "opacity-100 delay-700" : "opacity-0 delay-0"
          }`}
        >
          <div className="absolute left-[-68px] top-[50.8%] z-[1] h-[108px] w-[416px] -translate-y-1/2 rotate-[-4deg] bg-[linear-gradient(90deg,rgba(253,255,218,0.78),rgba(154,255,235,0.42)_40%,rgba(255,255,255,0)_100%)] blur-[9px] [clip-path:polygon(0_46.9%,100%_4%,100%_66%,0_53.1%)]" />
          <div className="absolute left-[228px] top-[50.4%] h-[86px] w-[269px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,224,0.58)_0%,rgba(122,255,233,0.22)_44%,rgba(255,255,255,0)_70%)] blur-[9px]" />
        </div>

        <aside
          className={`relative hidden bg-[#020714] transition duration-700 lg:block ${
            showPassword ? "bg-[#010814]" : ""
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(47,119,119,0.82),transparent_36%),linear-gradient(135deg,#020714_0%,#030716_68%,#020714_100%)]" />
          <div
            aria-hidden="true"
            className={`absolute bottom-0 left-0 right-0 h-[62%] transition-opacity duration-700 ${
              showPassword ? "opacity-100 delay-700" : "opacity-0 delay-0"
            } bg-[radial-gradient(circle_at_72%_42%,rgba(247,255,203,0.36),transparent_13%),radial-gradient(circle_at_80%_48%,rgba(65,244,220,0.24),transparent_22%)]`}
          />
          <div className="relative px-9 py-9">
            <img
              src="/icon/moxlite-icon-1.svg"
              className="h-[22px] w-auto"
              alt="Moxlite"
            />
          </div>
          <div
            aria-hidden="true"
            className={`absolute right-[55px] top-[68%] z-[2] w-[280px] scale-x-[-1] rotate-[-6deg] transition-all duration-700 ${
              showPassword
                ? "-translate-y-1/2 scale-100 opacity-100 delay-300 ]"
                : "-translate-y-[42%] scale-90 opacity-0 delay-0"
            }`}
          >
            <img
              src="/image/product_1.png"
              alt=""
              className="h-auto w-full select-none"
              draggable={false}
            />
            <span
              className={`absolute right-[38px] top-[36px] h-10 w-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,219,1),rgba(122,255,232,0.68)_48%,rgba(255,255,255,0)_74%)] blur-sm transition-opacity duration-500 ${
                showPassword ? "opacity-100 delay-700" : "opacity-0 delay-0"
              }`}
            />
          </div>
        </aside>

        <section
          className={`relative flex min-h-[620px] items-center justify-center overflow-hidden px-6 py-10 transition duration-700 sm:px-10 lg:px-14 ${
            showPassword
              ? "bg-[#071013]"
              : "bg-white"
          }`}
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              showPassword ? "opacity-100" : "opacity-0"
            } bg-[radial-gradient(circle_at_47%_49%,rgba(245,255,218,0.25),transparent_13%),radial-gradient(circle_at_50%_49%,rgba(83,255,228,0.22),transparent_20%),linear-gradient(135deg,rgba(0,0,0,0.84),rgba(2,13,17,0.94))]`}
          />
          <Link
            href={signupHref}
            className={`absolute right-8 top-8 z-[5] text-[11px] font-medium transition ${
              showPassword
                ? "text-white/82 hover:text-white"
                : "text-[#1c1c1f] hover:text-[#5a6472]"
            }`}
          >
            Sign Up
          </Link>

          <div
            className={`relative z-[5] w-full max-w-[310px] transition-all duration-700 ${
              showPassword
                ? "rounded-[8px] border border-white/30 bg-white/13 px-5 py-6 shadow-[0_22px_70px_rgba(0,0,0,0.5),0_0_74px_rgba(91,252,222,0.26)] backdrop-blur-xl"
                : ""
            }`}
          >
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
              <p
                className={`mt-2 text-[12px] transition ${
                  showPassword ? "text-white/68" : "text-[#7d828c]"
                }`}
              >
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
                className={`h-9 w-full rounded-[4px] border px-3 text-[12px] outline-none transition duration-500 placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10 ${
                  showPassword
                    ? "border-white/24 bg-white/82 shadow-[inset_0_0_18px_rgba(255,255,255,0.62)]"
                    : "border-[#d8dde5] bg-white"
                }`}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`h-9 w-full rounded-[4px] border px-3 pr-[70px] text-[12px] outline-none transition duration-500 placeholder:text-[#9aa1ab] focus:border-[#1f2329] focus:ring-2 focus:ring-[#1f2329]/10 ${
                    showPassword
                      ? "border-[#bfeee5] bg-white/82 shadow-[0_0_28px_rgba(113,232,211,0.52),inset_0_0_20px_rgba(255,255,255,0.92)]"
                      : "border-[#d8dde5] bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-2 top-1/2 h-6 -translate-y-1/2 rounded-[3px] px-2 text-[10px] font-semibold transition ${
                    showPassword
                      ? "bg-[#dffff8] text-[#095c55] shadow-[0_0_12px_rgba(91,232,207,0.46)]"
                      : "bg-[#f4f6f8] text-[#4e5662] hover:bg-[#e9edf1]"
                  }`}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className={`text-[10px] font-medium transition ${
                    showPassword
                      ? "text-white/78 hover:text-white"
                      : "text-[#1c1c1f] hover:text-[#5a6472]"
                  }`}
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`h-8 w-full rounded-[4px] text-[11px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  showPassword
                    ? "bg-[#0d191b] shadow-[0_0_22px_rgba(91,232,207,0.25)] hover:bg-[#142326]"
                    : "bg-[#1f1f21] hover:bg-[#343437]"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div
                className={`h-px flex-1 transition ${
                  showPassword ? "bg-white/18" : "bg-[#e3e6eb]"
                }`}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.06em] transition ${
                  showPassword ? "text-white/52" : "text-[#8c929c]"
                }`}
              >
                Or continue with
              </span>
              <div
                className={`h-px flex-1 transition ${
                  showPassword ? "bg-white/18" : "bg-[#e3e6eb]"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`flex h-8 w-full items-center justify-center gap-2 rounded-[4px] border text-[12px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                showPassword
                  ? "border-white/24 bg-white/84 text-[#1c1c1f] hover:bg-white"
                  : "border-[#d8dde5] bg-white text-[#1c1c1f] hover:bg-[#f7f8fa]"
              }`}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>

            <p
              className={`mx-auto mt-6 max-w-[260px] text-center text-[10px] leading-relaxed transition ${
                showPassword ? "text-white/56" : "text-[#8a9099]"
              }`}
            >
              Don&apos;t have an account?{" "}
              <Link
                href={signupHref}
                className={`font-medium transition ${
                  showPassword
                    ? "text-white/86 hover:text-white"
                    : "text-[#1c1c1f] hover:text-[#5a6472]"
                }`}
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
