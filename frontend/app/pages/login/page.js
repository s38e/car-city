"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = "https://car-city-api.vercel.app";
    // const apiUrl = "http://localhost:5000";

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });

      if (response && response.data) {
        // احفظ الـ role والتوكن في localStorage
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
        setMessage("Login successful");
        router.push("/pages/Booking"); // إعادة توجيه المستخدم بعد تسجيل الدخول
      } else {
        setMessage("Unexpected response format");
      }
    } catch (error) {
      console.error("Login error:", error); // عرض الأخطاء في وحدة التحكم
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");

    if (isLoggedIn) {
      router.push("/pages/Booking");
    }
  }, [router]);
  return (
    <main className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-2xl flex items-center justify-center">
      <div className="flex flex-col w-full max-w-md">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md outline-none"
            required
          />
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-black rounded-md outline-none"
          >
            Login
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </main>
  );
};

export default Login;

// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault(); // لمنع إعادة تحميل الصفحة

//     try {
//       // إرسال طلب تسجيل الدخول
//       const response = await axios.post("https://localhost:5000/login", {
//         email,
//         password,
//       });

//       // إذا كان تسجيل الدخول ناجحًا
//       setSuccess("Login successful!");
//       router.push("/pages/booking");
//       setError("");
//       console.log("User data:", response.data.user); // عرض بيانات المستخدم (قد تحتاج لتخزين رمز JWT إذا كان موجودًا)
//     } catch (err) {
//       // معالجة الخطأ
//       setError("Invalid email or password");
//       setSuccess("");
//     }
//   };

//   return (
//     <main className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-2xl flex items-center justify-center">
// <div className="flex flex-col w-full max-w-md">
//         <h1 className="mb-4 text-2xl font-bold">Login</h1>
// <form onSubmit={handleLogin} className="flex flex-col gap-3">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//           />
//           {error && <p className="text-xs text-red-500">{error}</p>}
//           {success && <p className="text-xs text-green-500">{success}</p>}
//           <button
//             type="submit"
// className="w-full px-3 py-2 text-white bg-black rounded-md outline-none"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }

// export default Login;
