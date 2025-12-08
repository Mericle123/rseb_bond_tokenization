"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "@/server/action/action";

export default function AdminLoginPage() {
  // Logic States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Form Submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    const result = await loginUser(formData);

    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage("✅ Login successful!");
      // router.push('/dashboard') if needed
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 bg-[url('/background-pattern.png')] bg-cover bg-center bg-no-repeat py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle overlay to improve readability */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Main Card */}
      <div
        className={`relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-7 sm:py-9 w-full max-w-md border border-white/50 transform transition-all duration-500 ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Top-right link */}
        <div className="absolute top-3 right-4 sm:top-4 sm:right-5">
          <Link
            href="/"
            className="text-[11px] sm:text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            Back to site
          </Link>
        </div>

        {/* Admin Tag */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] sm:text-xs font-semibold border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Admin Console
          </div>
        </div>

        {/* Logo Section (no extra color, just subtle effects) */}
        <div className="mb-4 sm:mb-5 transform transition-all duration-500 hover:scale-105">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto">
            <Image
              src="/RSEB.png"
              alt="RSEB Logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-center text-gray-800">
          Login
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 text-center mb-6 sm:mb-7">
          Use your credentials to access the dashboard.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 sm:gap-6">
          {/* Email Input */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full p-2.5 sm:p-3.5 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300 hover:border-gray-300 shadow-sm text-xs sm:text-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full p-2.5 sm:p-3.5 pl-9 sm:pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300 hover:border-gray-300 shadow-sm text-xs sm:text-sm"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl sm:py-3.5 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group text-xs sm:text-sm"
          >
            <span
              className={`relative z-10 transition-all duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                loading ? "opacity-100" : "opacity-0"
              }`}
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <div
            className={`mt-5 sm:mt-6 w-full p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-medium border transform transition-all duration-500 ${
              message.includes("❌")
                ? "bg-red-50 text-red-700 border-red-200 shadow-lg"
                : "bg-green-50 text-green-700 border-green-200 shadow-lg"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {message.includes("❌") ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="flex flex-col items-center w-full mt-6 sm:mt-7 gap-2.5 sm:gap-3 text-[11px] sm:text-xs">
          <Link
            href="/forgot-password"
            className="font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:underline"
          >
            Forgot Password?
          </Link>

          <div className="text-center">
            <span className="text-gray-600">Don&apos;t have an account?</span>
            <Link
              href="/auth/register"
              className="ml-2 font-semibold text-blue-600 hover:text-blue-800 transition-all duration-300 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
