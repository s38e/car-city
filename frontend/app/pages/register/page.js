"use client";
import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // لتحديد دور المستخدم افتراضيًا
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // لمنع إعادة تحميل الصفحة

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://carrcity.vercel.app";

    try {
      // إرسال طلب التسجيل
      const response = await axios.post(
        "https://car-city-api.vercel.app/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      // إذا كان التسجيل ناجحًا
      setSuccess("Registration successful!");
      setError("");
      console.log("User data:", response.data.user);
    } catch (err) {
      // معالجة الخطأ
      setError("Registration failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <main className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-2xl flex items-center justify-center flex-col">
      <div className="flex flex-col w-full max-w-md">
        <h1 className="mb-4 text-2xl font-bold">Create Account</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2 text-sm border rounded-md outline-none"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 text-sm border rounded-md outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 text-sm border rounded-md outline-none"
            required
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-green-500">{success}</p>}
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-black rounded-md outline-none"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}

export default Register;
