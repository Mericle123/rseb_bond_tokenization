"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/server/action/action";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Calendar,
  CreditCard,
  ShieldCheck,
  Lock,
} from "lucide-react";

type ErrorState = {
  national_id?: string;
  name?: string;
  dob?: string;
  email?: string;
  password?: string;
  role?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  // Logic States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function validate(values: {
    national_id: string;
    name: string;
    dob: string;
    email: string;
    password: string;
    role: string;
  }): ErrorState {
    const newErrors: ErrorState = {};

    // National ID: required, digits only, 6–18 digits
    if (!values.national_id) {
      newErrors.national_id = "National ID is required.";
    } else if (!/^\d{6,18}$/.test(values.national_id)) {
      newErrors.national_id = "National ID must be 6–18 digits.";
    }

    // Name: required, at least 2 chars
    if (!values.name) {
      newErrors.name = "Full name is required.";
    } else if (values.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // DOB: required, valid date, age >= 18
    if (!values.dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const dobDate = new Date(values.dob);
      if (isNaN(dobDate.getTime())) {
        newErrors.dob = "Please enter a valid date.";
      } else {
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.dob = "You must be at least 18 years old.";
        }
      }
    }

    // Email
    if (!values.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.toLowerCase())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password: required, 8+ chars, uppercase, lowercase, number, special
    if (!values.password) {
      newErrors.password = "Password is required.";
    } else {
      const pwd = values.password;
      const issues: string[] = [];
      if (pwd.length < 8) issues.push("at least 8 characters");
      if (!/[A-Z]/.test(pwd)) issues.push("an uppercase letter");
      if (!/[a-z]/.test(pwd)) issues.push("a lowercase letter");
      if (!/[0-9]/.test(pwd)) issues.push("a number");
      if (!/[!@#$%^&*(),.?\":{}|<>_\-+=;'/\\[\]]/.test(pwd))
        issues.push("a special character");

      if (issues.length > 0) {
        newErrors.password =
          "Password must include " + issues.join(", ") + ".";
      }
    }

    // Role
    if (!values.role) {
      newErrors.role = "Role is required.";
    } else if (!["user", "admin"].includes(values.role)) {
      newErrors.role = "Invalid role selected.";
    }

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const national_id = (formData.get("national_id") || "").toString().trim();
    const name = (formData.get("name") || "").toString().trim();
    const dob = (formData.get("dob") || "").toString();
    const email = (formData.get("email") || "").toString().trim();
    const password = (formData.get("password") || "").toString();
    const role = (formData.get("role") || "").toString();

    const validationErrors = validate({
      national_id,
      name,
      dob,
      email,
      password,
      role,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const result = await registerUser(formData);

    if (!result) {
      setMessage("❌ Registration failed. Please try again.");
    } else {
      setMessage("✅ Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    }

    setLoading(false);
  }

  const fieldClass = (hasError?: string) =>
    `w-full p-2.5 sm:p-3 border rounded-xl bg-white transition-all text-xs sm:text-sm
    ${
      hasError
        ? "border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        : "border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300"
    }`;

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

        {/* Tag */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-semibold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            New Investor Registration
          </div>
        </div>

        {/* Logo */}
        <div className="mb-4 sm:mb-5 transform transition-all duration-500 hover:scale-105">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
            <Image
              src="/RSEB.png"
              alt="RSEB Logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Title & subtitle */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 text-center mb-6 sm:mb-7">
          Register to get access to the RSEB bond platform.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5 sm:gap-4">
          {/* National ID */}
          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
              National ID
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                name="national_id"
                placeholder="Enter your national ID"
                className={`${fieldClass(errors.national_id)} pl-9`}
                required
              />
            </div>
            {errors.national_id && (
              <p className="text-[10px] sm:text-[11px] text-red-600 mt-1">
                {errors.national_id}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className={`${fieldClass(errors.name)} pl-9`}
                required
              />
            </div>
            {errors.name && (
              <p className="text-[10px] sm:text-[11px] text-red-600 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="dob"
                className={`${fieldClass(errors.dob)} pl-9 text-gray-600`}
                required
              />
            </div>
            {errors.dob && (
              <p className="text-[10px] sm:text-[11px] text-red-600 mt-1">
                {errors.dob}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className={`${fieldClass(errors.email)} pl-9`}
                required
              />
            </div>
            {errors.email && (
              <p className="text-[10px] sm:text-[11px] text-red-600 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                className={`${fieldClass(errors.password)} pl-9 pr-10`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">
              Use at least 8 characters with uppercase, lowercase, number and special character.
            </p>
            {errors.password && (
              <p className="text-[10px] sm:text-[11px] text-red-600 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
              Role
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                name="role"
                className={`${fieldClass(
                  errors.role
                )} pl-9 pr-8 text-gray-600 appearance-none`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
            {errors.role && (
              <p className="text-[10px] sm:text-[11px] text-red-600 mt-1">
                {errors.role}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl sm:py-3.5 hover:bg-blue-700 active:scale-[0.98] transition duration-300 font-semibold shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none mt-2 relative overflow-hidden group text-xs sm:text-sm"
            disabled={loading}
          >
            <span
              className={`relative z-10 transition-all duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            >
              {loading ? "Registering..." : "Register"}
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
            className={`mt-5 w-full p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-medium border transform transition-all duration-500 ${
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

        {/* Footer Link */}
        <div className="flex items-center justify-center w-full mt-6 text-[11px] sm:text-xs">
          <span className="text-gray-600">Already have an account?</span>
          <Link
            href="/auth/login"
            className="ml-2 text-blue-600 hover:text-blue-800 hover:underline transition font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
