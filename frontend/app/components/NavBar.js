"use client";
import { assets } from "@/public/assets/assets";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function NavBar() {
  const [user, setUser] = useState(null);
  let token = null;

  // تحقق من تواجد نافذة المتصفح (window) قبل الوصول إلى localStorage
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://carrcity.vercel.app";

    // تحقق من تواجد التوكن قبل إرسال الطلب باستخدام axios
    if (token) {
      axios
        .get("https://car-city-api.vercel.app/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        });
    }
  }, [token]);

  // وظيفة لاستخراج أول اسم من الاسم الكامل
  const getFirstName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  return (
    <nav
      dir="rtl"
      className="flex items-center justify-between h-[70px] w-full px-8 sticky top-0 left-0 bg-[#ffffff90] backdrop-blur-lg border-b"
    >
      <div className="flex items-center justify-between gap-3 px-3 py-2 border rounded-md border-neutral-300">
        <Image src={assets.searchIcon} alt="search icon" className="w-5 h-5" />
        <input
          type="text"
          className="text-sm bg-transparent border-none outline-none"
          placeholder="ابحث عن أي شيئ"
        />
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <p className="text-sm">
            مرحبا استاذ :{" "}
            <span className="font-medium">{getFirstName(user.name)}</span>
          </p>
          <button className="p-[6px] bg-neutral-100 border rounded-lg">
            <Image src={assets.bellIcon} alt="bell icon" className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <p className="text-sm">
          مرحبا استاذ : <span className="font-medium">جاري التحميل...</span>
        </p>
      )}
    </nav>
  );
}

export default NavBar;

// "use client";
// import { assets } from "@/public/assets/assets";
// import axios from "axios";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// function NavBar() {
//   const [user, setUser] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const apiUrl =
//       process.env.NEXT_PUBLIC_API_URL || "https://carcity.vercel.app";

//     // إرسال الطلب باستخدام axios
//     axios
//       .get("current-user`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((response) => {
//         setUser(response.data.user);
//       })
//       .catch((error) => {
//         console.error(
//           "Error:",
//           error.response ? error.response.data : error.message
//         );
//       });
//   }, []);

//   // وظيفة لاستخراج أول اسم من الاسم الكامل
//   const getFirstName = (fullName) => {
//     if (!fullName) return "";
//     return fullName.split(" ")[0];
//   };

//   return (
//     <nav dir="rtl" className="flex items-center justify-between h-[70px] w-full px-8 sticky top-0 left-0 bg-[#ffffff90] backdrop-blur-lg border-b">
//       <div className="flex items-center justify-between gap-3 px-3 py-2 border rounded-md border-neutral-300">
//         <Image src={assets.searchIcon} alt="search icon" className="w-5 h-5" />
//         <input
//           type="text"
//           className="text-sm bg-transparent border-none outline-none"
//           placeholder="ابحث عن أي شيئ"
//         />
//       </div>
//       {user ? (
//         <div className="flex items-center gap-3">
//           <p className="text-sm">
//             مرحبا استاذ :{" "}
//             <span className="font-medium">{getFirstName(user.name)}</span>
//           </p>
//           <button className="p-[6px] bg-neutral-100 border rounded-lg">
//             <Image src={assets.bellIcon} alt="bell icon" className="w-5 h-5" />
//           </button>
//         </div>
//       ) : (
//         <p className="text-sm">
//           مرحبا استاذ : <span className="font-medium">جاري التحميل...</span>
//         </p>
//       )}
//     </nav>
//   );
// }

// export default NavBar;
