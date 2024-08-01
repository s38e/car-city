"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "/app/globals.css";
import { useRouter } from "next/navigation";

const BookingPage = () => {
  const [startTime, setStartTime] = useState(null);
  const [carDetails, setCarDetails] = useState("");
  const [washType, setWashType] = useState("external");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serialNumber, setSerialNumber] = useState(""); // إضافة حالة الرقم التسلسلي

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تحقق من تواجد نافذة المتصفح (window) قبل الوصول إلى localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); // الحصول على التوكن من التخزين المحلي

      if (!token) {
        setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول مرة أخرى.");
        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://carrcity.vercel.app";

      try {
        const response = await axios.post(
          "https://car-city-api.vercel.app/book",
          {
            startTime,
            carDetails,
            washType,
            comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess(response.data.message);
        setSerialNumber(response.data.booking.serialNumber); // تعيين الرقم التسلسلي
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "خطأ في الحجز");
        setSuccess("");
      }
    }
  };

  useEffect(() => {
    // تحقق من تواجد نافذة المتصفح (window) قبل الوصول إلى localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/pages/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    // تحقق من تواجد نافذة المتصفح (window) قبل الوصول إلى localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/pages/login");
    }
  };

  return (
    <main className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-2xl flex items-center justify-center">
      <div className="flex flex-col w-full max-w-md">
        <h1 className="mb-4 text-2xl font-bold">احجز غسيل سيارة</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>
            وقت البدء:
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat="Pp"
              minDate={new Date()} // عدم السماح باختيار تواريخ ماضية
              filterDate={(date) => date.getDay() !== 6} // منع الحجز يوم السبت
              timeIntervals={45} // تحديد 45 دقيقة كفاصل زمني
              minTime={new Date().setHours(0, 0, 0, 0)} // بدء من الساعة 12 صباحاً
              maxTime={new Date().setHours(22, 0, 0, 0)} // انتهاء الساعة 10 مساءً
              className="w-full px-3 py-2 text-sm border rounded-md outline-none"
            />
          </label>
          <label>
            تفاصيل السيارة:
            <input
              type="text"
              value={carDetails}
              onChange={(e) => setCarDetails(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md outline-none"
              required
            />
          </label>
          <label>
            نوع الغسيل:
            <select
              value={washType}
              onChange={(e) => setWashType(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md outline-none"
              required
            >
              <option value="external">خارجي</option>
              <option value="internal">داخلي</option>
              <option value="both">كلاهما</option>
            </select>
          </label>
          <label>
            تعليق:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-black rounded-md outline-none"
          >
            احجز الآن
          </button>
        </form>
        {success && (
          <p>
            {success}
            {serialNumber && <span> رقم الحجز: {serialNumber}</span>}{" "}
            {/* عرض الرقم التسلسلي */}
          </p>
        )}
        {error && <p>{error}</p>}
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
      >
        تسجيل الخروج
      </button>
    </main>
  );
};

export default BookingPage;

// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "/app/globals.css";
// import { useRouter } from "next/navigation";

// const BookingPage = () => {
//   const [startTime, setStartTime] = useState(null);
//   const [carDetails, setCarDetails] = useState("");
//   const [washType, setWashType] = useState("external");
//   const [comment, setComment] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [serialNumber, setSerialNumber] = useState(""); // إضافة حالة الرقم التسلسلي

//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token"); // الحصول على التوكن من التخزين المحلي

//     if (!token) {
//       setError("لم يتم العثور على التوكن. يرجى تسجيل الدخول مرة أخرى.");
//       return;
//     }

//     const apiUrl =
//       process.env.NEXT_PUBLIC_API_URL || "https://carcity.vercel.app";

//     try {
//       const response = await axios.post(
//         "book`,
//         {
//           startTime,
//           carDetails,
//           washType,
//           comment,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSuccess(response.data.message);
//       setSerialNumber(response.data.booking.serialNumber); // تعيين الرقم التسلسلي
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "خطأ في الحجز");
//       setSuccess("");
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.push("/pages/login");
//     }
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     router.push("/pages/login");
//   };

//   return (
//     <main className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-2xl flex items-center justify-center">
//       <div className="flex flex-col w-full max-w-md">
//         <h1 className="mb-4 text-2xl font-bold">احجز غسيل سيارة</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <label>
//             وقت البدء:
//             <DatePicker
//               selected={startTime}
//               onChange={(date) => setStartTime(date)}
//               showTimeSelect
//               dateFormat="Pp"
//               minDate={new Date()} // عدم السماح باختيار تواريخ ماضية
//               filterDate={(date) => date.getDay() !== 6} // منع الحجز يوم السبت
//               timeIntervals={45} // تحديد 45 دقيقة كفاصل زمني
//               minTime={new Date().setHours(0, 0, 0, 0)} // بدء من الساعة 12 صباحاً
//               maxTime={new Date().setHours(22, 0, 0, 0)} // انتهاء الساعة 10 مساءً
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//             />
//           </label>
//           <label>
//             تفاصيل السيارة:
//             <input
//               type="text"
//               value={carDetails}
//               onChange={(e) => setCarDetails(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//               required
//             />
//           </label>
//           <label>
//             نوع الغسيل:
//             <select
//               value={washType}
//               onChange={(e) => setWashType(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//               required
//             >
//               <option value="external">خارجي</option>
//               <option value="internal">داخلي</option>
//               <option value="both">كلاهما</option>
//             </select>
//           </label>
//           <label>
//             تعليق:
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//             />
//           </label>
//           <button
//             type="submit"
//             className="w-full px-3 py-2 text-white bg-black rounded-md outline-none"
//           >
//             احجز الآن
//           </button>
//         </form>
//         {success && (
//           <p>
//             {success}
//             {serialNumber && <span> رقم الحجز: {serialNumber}</span>}{" "}
//             {/* عرض الرقم التسلسلي */}
//           </p>
//         )}
//         {error && <p>{error}</p>}
//       </div>
//       <button
//         onClick={handleLogout}
//         className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
//       >
//         تسجيل الخروج
//       </button>
//     </main>
//   );
// };

// export default BookingPage;

// ----------------------------------------------- 2 -----------------------------------------------
// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "/app/globals.css";
// import { useRouter } from "next/navigation";

// const BookingPage = () => {
//   const [startTime, setStartTime] = useState(null);
//   const [carDetails, setCarDetails] = useState("");
//   const [washType, setWashType] = useState("external");
//   const [comment, setComment] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token"); // الحصول على التوكن من التخزين المحلي

//     if (!token) {
//       setError("No token found. Please log in again.");
//       return;
//     }

//     const apiUrl =
//       process.env.NEXT_PUBLIC_API_URL || "https://carcity.vercel.app";

//     try {
//       const response = await axios.post(
//         "book`,
//         {
//           startTime,
//           carDetails,
//           washType,
//           comment,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSuccess(response.data.message);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Error booking");
//       setSuccess("");
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.push("/pages/login");
//     }
//   });

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     router.push("/pages/login");
//   };

//   return (
//     <main className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-2xl flex items-center justify-center">
//       <div className="flex flex-col w-full max-w-md">
//         <h1 className="mb-4 text-2xl font-bold">Book a Car Wash</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <label>
//             Start Time:
//             <DatePicker
//               selected={startTime}
//               onChange={(date) => setStartTime(date)}
//               showTimeSelect
//               dateFormat="Pp"
//               minDate={new Date()} // عدم السماح باختيار تواريخ ماضية
//               filterDate={(date) => date.getDay() !== 6} // منع الحجز يوم السبت
//               timeIntervals={45} // تحديد 45 دقيقة كفاصل زمني
//               minTime={new Date().setHours(0, 0, 0, 0)} // بدء من الساعة 12 صباحاً
//               maxTime={new Date().setHours(22, 0, 0, 0)} // انتهاء الساعة 10 مساءً
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//             />
//           </label>
//           <label>
//             Car Details:
//             <input
//               type="text"
//               value={carDetails}
//               onChange={(e) => setCarDetails(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//               required
//             />
//           </label>
//           <label>
//             Wash Type:
//             <select
//               value={washType}
//               onChange={(e) => setWashType(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//               required
//             >
//               <option value="external">External</option>
//               <option value="internal">Internal</option>
//               <option value="both">Both</option>
//             </select>
//           </label>
//           <label>
//             Comment:
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               className="w-full px-3 py-2 text-sm border rounded-md outline-none"
//             />
//           </label>
//           <button
//             type="submit"
//             className="w-full px-3 py-2 text-white bg-black rounded-md outline-none"
//           >
//             Book Now
//           </button>
//         </form>
//         {success && <p>{success}</p>}
//         {error && <p>{error}</p>}
//       </div>
//       <button onClick={handleLogout}>Logout</button>
//     </main>
//   );
// };

// export default BookingPage;
// ----------------------------------------------- 1 -----------------------------------------------
// "use client";
// import { useState } from "react";
// import axios from "axios";

// const BookWashCar = () => {
//   const [startTime, setStartTime] = useState("");
//   const [carDetails, setCarDetails] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // الحصول على التوكن من الكاش (مثلاً من localStorage)
//     const token = localStorage.getItem("token");

//     try {
//       const response = await axios.post(
//         "https://localhost:5000/book",
//         {
//           startTime,
//           carDetails,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage("Booking successful");
//     } catch (error) {
//       console.error("Booking error:", error);
//       if (error.response?.data?.nextAvailable) {
//         setMessage(
//           `The selected time slot is already booked. Next available slot: ${new Date(
//             error.response.data.nextAvailable.startTime
//           ).toLocaleString()} - ${new Date(
//             error.response.data.nextAvailable.endTime
//           ).toLocaleString()}`
//         );
//       } else {
//         setMessage(error.response?.data?.message || "Error occurred");
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Book a Car</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="datetime-local"
//           value={startTime}
//           onChange={(e) => setStartTime(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Car Details"
//           value={carDetails}
//           onChange={(e) => setCarDetails(e.target.value)}
//           required
//         />
//         <button type="submit">Book</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default BookWashCar;
