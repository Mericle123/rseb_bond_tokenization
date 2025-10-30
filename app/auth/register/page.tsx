"use client";

import { useState } from "react";
import { registerUser } from "@/server/action/action";
import { redirect } from "next/navigation";
import { success } from "zod";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (!result) setMessage(`❌ ${!result}`);
    else setMessage("✅ Registration successful!");

    setLoading(false);
    redirect("/auth/login")    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>

        <label className="block mb-2 text-gray-700">National ID</label>
        <input type="number" name="national_id" className="w-full p-2 border rounded-lg mb-4" required />

        <label className="block mb-2 text-gray-700">Name</label>
        <input type="text" name="name" className="w-full p-2 border rounded-lg mb-4" required />


        <label className="block mb-2 text-gray-700">Email</label>
        <input type="email" name="email" className="w-full p-2 border rounded-lg mb-4" required />

        <label className="block mb-2 text-gray-700">Password</label>
        <input type="password" name="password" className="w-full p-2 border rounded-lg mb-4" required />

        <label className="block mb-2 text-gray-700">Role</label>
        <select name="role" className="w-full p-2 border rounded-lg mb-4">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
