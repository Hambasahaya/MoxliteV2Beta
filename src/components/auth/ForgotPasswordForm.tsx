import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { activityTracker } from "@/lib/activityTracker";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirebaseConfigured) {
      enqueueSnackbar("Firebase auth is not configured yet.", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      await activityTracker.trackActivity(null, "password_reset_requested", {
        email,
      });
      setSubmitted(true);
      enqueueSnackbar("Reset link sent to your email!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to send reset link",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 lg:p-12 shadow-2xl space-y-6">
        {/* Back Link */}
        <Link
          href="/auth/login"
          className="text-slate-600 hover:text-slate-900 text-sm flex items-center space-x-1 transition"
        >
          <span>&larr;</span>
          <span>Back to Login</span>
        </Link>

        {/* Form Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">
            Reset Password
          </h2>
          <p className="text-slate-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Email Sent!</h3>
              <p className="text-slate-600 text-sm mt-1">
                Check your email for a link to reset your password. The link expires in 24 hours.
              </p>
            </div>
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition duration-300"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
