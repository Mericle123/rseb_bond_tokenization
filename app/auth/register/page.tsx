"use client";

import { useState } from "react";
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
  ShieldCheck 
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  // Logic States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (!result) {
        // Assuming your server action returns null/false on failure based on your snippet
        // Ideally, your action should return { error: string } so you can show the real error.
        setMessage("❌ Registration failed. Please try again.");
    } else {
        setMessage("✅ Registration successful! Redirecting...");
        // Wait a moment so user sees the success message, then redirect
        setTimeout(() => {
            router.push("/auth/login");
        }, 1500);
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 bg-[url('/background-pattern.png')] bg-cover bg-center bg-no-repeat py-10">
      
      <div className="relative z-10 bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center border border-gray-100">
        
        {/* Logo Section */}
        <div className="mb-6">
          <Image
            src="/RSEB.png" // Ensure this exists in public/
            alt="RSEB Logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          
          {/* National ID */}
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="national_id"
              placeholder="National ID"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 transition-all"
              required
            />
          </div>

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 transition-all"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="dob"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 transition-all text-gray-600"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 transition-all"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Role Selection */}
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select 
                name="role" 
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 transition-all text-gray-600 appearance-none"
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            {/* Custom chevron for select */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition duration-200 font-semibold shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed mt-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <div className={`mt-4 w-full text-center p-3 rounded-lg text-sm font-medium ${message.includes("❌") ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}>
            {message}
          </div>
        )}

        {/* Footer Link */}
        <div className="flex items-center justify-center w-full mt-6 text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <Link href="/auth/login" className="ml-2 text-blue-600 hover:text-blue-800 hover:underline transition font-medium">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}