// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import NavBar from "/app/components/NavBar";
// import AllBookings from "/app/components/AllBookings";
// import "/app/globals.css";

// function Dashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // تحقق من تواجد نافذة المتصفح (window)
//     if (typeof window !== "undefined") {
//       const role = localStorage.getItem("role");
//       const token = localStorage.getItem("token");

//       if (
//         role === "user" ||
//         role === null ||
//         role === undefined ||
//         token === null ||
//         token === undefined
//       ) {
//         router.push("/pages/Booking");
//         return;
//       }

//       // إعداد interceptor للـ axios
//       const axiosInterceptor = axios.interceptors.response.use(
//         (response) => response,
//         (error) => {
//           if (error.response && error.response.status === 401) {
//             router.push("/pages/login");
//             localStorage.removeItem("token");
//             localStorage.removeItem("role");
//           }
//           return Promise.reject(error);
//         }
//       );

//       // الحصول على التوكن من localStorage
//       if (!token) {
//         console.error("No token found in localStorage");
//         router.push("/pages/login");
//         return;
//       }
//       const apiUrl =
//         process.env.NEXT_PUBLIC_API_URL || "https://carrcity.vercel.app";

//       // إجراء طلب للحصول على المستخدم الحالي
//       axios
//         .get("http://localhost:5000/current-user", {
//           headers: { Authorization: "Bearer ${token}" },
//         })
//         .then((response) => {
//           setUser(response.data);
//         })
//         .catch((error) => {
//           console.error(error);
//         });

//       // إزالة interceptor عند تنظيف التأثير
//       return () => {
//         axios.interceptors.response.eject(axiosInterceptor);
//       };
//     }
//   }, [router]);

//   return (
//     <div className="flex justify-between overflow-hidden h-dvh">
//       {/* ------------------- Menu ------------------- */}
//       <div className="w-[270px] bg-white h-dvh sticky flex flex-col items-center justify-between left-0 bottom-0 border-r">
//         <p className="p-4 font-bold">Menu</p>
//       </div>
//       {/* ------------------- Content ------------------- */}
//       <div className="flex-1 overflow-y-auto Content bg-neutral-100">
//         <NavBar />
//         <AllBookings />
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import NavBar from "/app/components/NavBar";
import AllBookings from "/app/components/AllBookings";
import "/app/globals.css";

function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (
      role === "user" ||
      role === null ||
      role === undefined ||
      token === null ||
      token === undefined
    ) {
      router.push("/pages/Booking");
      return;
    }

    // إعداد interceptor للـ axios
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          router.push("/pages/login");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
        return Promise.reject(error);
      }
    );

    // الحصول على التوكن من localStorage
    if (!token) {
      console.error("No token found in localStorage");
      router.push("/pages/login");
      return;
    }

    const apiUrl = "https://car-city-api.vercel.app";
    // const apiUrl = "http://localhost:5000";

    // إجراء طلب للحصول على المستخدم الحالي
    axios
      .get(`${apiUrl}/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // إزالة interceptor عند تنظيف التأثير
    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, [router]);

  return (
    <div className="flex justify-between overflow-hidden h-dvh">
      {/* ------------------- Menu ------------------- */}
      <div className="w-[270px] bg-white h-dvh sticky flex flex-col items-center justify-between left-0 bottom-0 border-r">
        <p className="p-4 font-bold">Menu</p>
      </div>
      {/* ------------------- Content ------------------- */}
      <div className="flex-1 overflow-y-auto Content bg-neutral-100">
        <NavBar />
        <AllBookings />
      </div>
    </div>
  );
}

export default Dashboard;
