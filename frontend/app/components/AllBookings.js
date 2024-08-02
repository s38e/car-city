"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Image from "next/image";
import "/app/globals.css";
import { assets } from "@/public/assets/assets";

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const apiUrl = "https://car-city-api.vercel.app";
  // const apiUrl = "http://localhost:5000";
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bookings`);
        setBookings(response.data);
      } catch (err) {
        setError("فشل في جلب الحجوزات");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600">جاري التحميل...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Helper function to format date
  const formatDate = (date) => {
    const optionsDate = { day: "numeric", month: "short" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("ar-AR", optionsDate);
    const formattedTime = dateObj.toLocaleTimeString("ar-AR", optionsTime);

    return `${formattedDate} | ${formattedTime}`;
  };

  // Helper function to get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-100 text-yellow-800";
      case "Wash":
        return "bg-blue-100 text-blue-800";
      case "Done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle status update
  const handleStatusChange = async (bookingId) => {
    try {
      await axios.put(`${apiUrl}/bookings/${bookingId}`, {
        status: newStatus,
      });
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      setUpdating(null);
      setNewStatus("");
    } catch (err) {
      setError("فشل في تحديث الحالة");
      console.error("Error updating status:", err);
    }
  };

  // Handle delete booking
  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`${apiUrl}/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      setError("فشل في حذف الحجز");
      console.error("Error deleting booking:", err);
    }
  };

  // Options for select component
  const statusOptions = [
    { value: "Waiting", label: "انتظار" },
    { value: "Wash", label: "غسيل" },
    { value: "Done", label: "منجز" },
  ];

  return (
    <main
      dir="rtl"
      className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-lg p-6"
    >
      <h1 className="mb-6 text-3xl font-semibold text-center">جميع الحجوزات</h1>
      <div className="">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="text-gray-600 bg-gray-100">
            <tr>
              <th className="p-2 text-sm border border-gray-300">رقم الحجز</th>
              <th className="p-2 text-sm border border-gray-300">وقت البدء</th>
              <th className="p-2 text-sm border border-gray-300">
                وقت الانتهاء
              </th>
              <th className="p-2 text-sm border border-gray-300">
                تفاصيل السيارة
              </th>
              <th className="p-2 text-sm border border-gray-300">نوع الغسيل</th>
              <th className="p-2 text-sm border border-gray-300">تعليق</th>
              <th className="p-2 text-sm border border-gray-300">الحالة</th>
              <th className="p-2 text-sm border border-gray-300">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="p-2 text-sm text-center border border-gray-300">
                    {booking.serialNumber}
                  </td>
                  <td className="p-2 text-sm text-center border border-gray-300">
                    {formatDate(booking.startTime)}
                  </td>
                  <td className="p-2 text-sm text-center border border-gray-300">
                    {formatDate(booking.endTime)}
                  </td>
                  <td className="p-2 text-sm text-center border border-gray-300">
                    {booking.carDetails}
                  </td>
                  <td className="p-2 text-sm text-center border border-gray-300">
                    {booking.washType}
                  </td>
                  <td className="p-2 text-sm text-center border border-gray-300">
                    {booking.comment || "غير متوفر"}
                  </td>
                  <td className="p-2 text-sm text-center border border-gray-300">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status === "Waiting"
                        ? "انتظار"
                        : booking.status === "Wash"
                        ? "غسيل"
                        : "منجز"}
                    </span>
                  </td>

                  <td className="p-2 text-sm text-center border border-gray-300 min-w-[110px]">
                    <div className="flex justify-center gap-3">
                      {updating === booking._id ? (
                        <>
                          <Select
                            options={statusOptions}
                            value={statusOptions.find(
                              (option) => option.value === newStatus
                            )}
                            onChange={(option) => setNewStatus(option.value)}
                            className="w-32 p-0"
                          />
                          <button
                            onClick={() => handleStatusChange(booking._id)}
                            className="p-[6px] bg-neutral-100 border rounded-lg"
                          >
                            <Image
                              src={assets.correctIcon}
                              alt="حفظ"
                              className="w-5 h-5"
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setUpdating(booking._id);
                              setNewStatus(booking.status); // Set current status as initial value
                            }}
                            className="p-[6px] bg-neutral-100 border rounded-lg"
                          >
                            <Image
                              src={assets.editIcon}
                              alt="تعديل"
                              className="w-5 h-5"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="p-[6px] bg-neutral-100 border rounded-lg"
                          >
                            <Image
                              src={assets.deleteIcon}
                              alt="حذف"
                              className="w-5 h-5"
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="p-2 text-center border border-gray-300"
                >
                  لا توجد حجوزات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AllBookings;

// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import Image from "next/image";
// import { assets } from "@/public/assets/assets";
// import "/app/globals.css";

// function AllBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updating, setUpdating] = useState(null);
//   const [newStatus, setNewStatus] = useState("");

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const apiUrl =
//           process.env.NEXT_PUBLIC_API_URL || "https://carcity.vercel.app";
//         const response = await axios.get(`/bookings`);
//         setBookings(response.data);
//       } catch (err) {
//         setError("فشل في جلب الحجوزات");
//         console.error("Error fetching bookings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   if (loading)
//     return <p className="text-center text-gray-600">جاري التحميل...</p>;
//   if (error) return <p className="text-center text-red-600">{error}</p>;

//   // Helper function to format date
//   const formatDate = (date) => {
//     const optionsDate = { day: "numeric", month: "short" };
//     const optionsTime = { hour: "2-digit", minute: "2-digit" };

//     const dateObj = new Date(date);
//     const formattedDate = dateObj.toLocaleDateString("ar-AR", optionsDate);
//     const formattedTime = dateObj.toLocaleTimeString("ar-AR", optionsTime);

//     return `${formattedDate} | ${formattedTime}`;
//   };

//   // Helper function to get status style
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "Waiting":
//         return "bg-yellow-100 text-yellow-800";
//       case "Wash":
//         return "bg-blue-100 text-blue-800";
//       case "Done":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Handle status update
//   const handleStatusChange = async (bookingId) => {
//     try {
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`,
//         { status: newStatus }
//       );
//       setBookings(
//         bookings.map((booking) =>
//           booking._id === bookingId
//             ? { ...booking, status: newStatus }
//             : booking
//         )
//       );
//       setUpdating(null);
//       setNewStatus("");
//     } catch (err) {
//       setError("فشل في تحديث الحالة");
//       console.error("Error updating status:", err);
//     }
//   };

//   // Handle delete booking
//   const handleDelete = async (bookingId) => {
//     try {
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`
//       );
//       setBookings(bookings.filter((booking) => booking._id !== bookingId));
//     } catch (err) {
//       setError("فشل في حذف الحجز");
//       console.error("Error deleting booking:", err);
//     }
//   };

//   // Options for select component
//   const statusOptions = [
//     { value: "Waiting", label: "انتظار" },
//     { value: "Wash", label: "غسيل" },
//     { value: "Done", label: "منجز" },
//   ];

//   return (
//     <main
//       dir="rtl"
//       className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-lg p-6"
//     >
//       <h1 className="mb-6 text-3xl font-semibold text-center">جميع الحجوزات</h1>
//       <div className="">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//           <thead className="text-gray-600 bg-gray-100">
//             <tr>
//               <th className="p-2 text-sm border border-gray-300">رقم الحجز</th>
//               <th className="p-2 text-sm border border-gray-300">وقت البدء</th>
//               <th className="p-2 text-sm border border-gray-300">
//                 وقت الانتهاء
//               </th>
//               <th className="p-2 text-sm border border-gray-300">
//                 تفاصيل السيارة
//               </th>
//               <th className="p-2 text-sm border border-gray-300">نوع الغسيل</th>
//               <th className="p-2 text-sm border border-gray-300">تعليق</th>
//               <th className="p-2 text-sm border border-gray-300">الحالة</th>
//               <th className="p-2 text-sm border border-gray-300">الإجراءات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.length > 0 ? (
//               bookings.map((booking) => (
//                 <tr key={booking._id} className="hover:bg-gray-50">
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking._id}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {formatDate(booking.startTime)}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {formatDate(booking.endTime)}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking.carDetails}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking.washType}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking.comment || "غير متوفر"}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     <span
//                       className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
//                         booking.status
//                       )}`}
//                     >
//                       {booking.status === "Waiting"
//                         ? "انتظار"
//                         : booking.status === "Wash"
//                         ? "غسيل"
//                         : "منجز"}
//                     </span>
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300 min-w-[110px]">
//                     <div className="flex justify-center gap-3">
//                       {updating === booking._id ? (
//                         <>
//                           <Select
//                             options={statusOptions}
//                             value={statusOptions.find(
//                               (option) => option.value === newStatus
//                             )}
//                             onChange={(option) => setNewStatus(option.value)}
//                             className="w-32 p-0"
//                           />
//                           <button
//                             onClick={() => handleStatusChange(booking._id)}
//                             className="p-[6px] bg-neutral-100 border rounded-lg"
//                           >
//                             <Image
//                               src={assets.correctIcon}
//                               alt="حفظ"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => {
//                               setUpdating(booking._id);
//                               setNewStatus(booking.status); // Set current status as initial value
//                             }}
//                             className="p-[6px] bg-neutral-100 border rounded-lg"
//                           >
//                             <Image
//                               src={assets.editIcon}
//                               alt="تعديل"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(booking._id)}
//                             className="p-[6px] bg-neutral-100 border rounded-lg"
//                           >
//                             <Image
//                               src={assets.deleteIcon}
//                               alt="حذف"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="p-2 text-center border border-gray-300"
//                 >
//                   لا توجد حجوزات متاحة
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

// export default AllBookings;
// --------------------------------------------------------------------
// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import Image from "next/image";
// import { assets } from "@/public/assets/assets";
// import "/app/globals.css";

// function AllBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updating, setUpdating] = useState(null);
//   const [newStatus, setNewStatus] = useState("");

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const apiUrl =
//           process.env.NEXT_PUBLIC_API_URL || "https://carcity.vercel.app";
//         const response = await axios.get(`/bookings`);
//         setBookings(response.data);
//       } catch (err) {
//         setError("Failed to fetch bookings");
//         console.error("Error fetching bookings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   if (loading) return <p className="text-center text-gray-600">Loading...</p>;
//   if (error) return <p className="text-center text-red-600">{error}</p>;

//   // Helper function to format date
//   const formatDate = (date) => {
//     const optionsDate = { day: "numeric", month: "short" };
//     const optionsTime = { hour: "2-digit", minute: "2-digit" };

//     const dateObj = new Date(date);
//     const formattedDate = dateObj.toLocaleDateString("en-US", optionsDate);
//     const formattedTime = dateObj.toLocaleTimeString("en-US", optionsTime);

//     return `${formattedDate} | ${formattedTime}`;
//   };

//   // Helper function to get status style
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "Waiting":
//         return "bg-yellow-100 text-yellow-800";
//       case "Wash":
//         return "bg-blue-100 text-blue-800";
//       case "Done":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Handle status update
//   const handleStatusChange = async (bookingId) => {
//     try {
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`,
//         { status: newStatus }
//       );
//       setBookings(
//         bookings.map((booking) =>
//           booking._id === bookingId
//             ? { ...booking, status: newStatus }
//             : booking
//         )
//       );
//       setUpdating(null);
//       setNewStatus("");
//     } catch (err) {
//       setError("Failed to update status");
//       console.error("Error updating status:", err);
//     }
//   };

//   // Handle delete booking
//   const handleDelete = async (bookingId) => {
//     try {
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`
//       );
//       setBookings(bookings.filter((booking) => booking._id !== bookingId));
//     } catch (err) {
//       setError("Failed to delete booking");
//       console.error("Error deleting booking:", err);
//     }
//   };

//   // Options for select component
//   const statusOptions = [
//     { value: "Waiting", label: "Waiting" },
//     { value: "Wash", label: "Wash" },
//     { value: "Done", label: "Done" },
//   ];

//   return (
//     <main className="w-[calc(100%-2rem)] m-4 bg-white h-[calc(100dvh-2rem)] rounded-lg p-6">
//       <h1 className="mb-6 text-3xl font-semibold text-center">All Bookings</h1>
//       <div className="">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//           <thead className="text-gray-600 bg-gray-100">
//             <tr>
//               <th className="p-2 text-sm border border-gray-300">Booking ID</th>
//               <th className="p-2 text-sm border border-gray-300">Start Time</th>
//               <th className="p-2 text-sm border border-gray-300">End Time</th>
//               <th className="p-2 text-sm border border-gray-300">
//                 Car Details
//               </th>
//               <th className="p-2 text-sm border border-gray-300">Wash Type</th>
//               <th className="p-2 text-sm border border-gray-300">Comment</th>
//               <th className="p-2 text-sm border border-gray-300">Status</th>
//               <th className="p-2 text-sm border border-gray-300">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.length > 0 ? (
//               bookings.map((booking) => (
//                 <tr key={booking._id} className="hover:bg-gray-50">
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking._id}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {formatDate(booking.startTime)}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {formatDate(booking.endTime)}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking.carDetails}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking.washType}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     {booking.comment || "N/A"}
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300">
//                     <span
//                       className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
//                         booking.status
//                       )}`}
//                     >
//                       {booking.status}
//                     </span>
//                   </td>
//                   <td className="p-2 text-sm text-center border border-gray-300 min-w-[110px]">
//                     <div className="flex justify-center gap-3">
//                       {updating === booking._id ? (
//                         <>
//                           <Select
//                             options={statusOptions}
//                             value={statusOptions.find(
//                               (option) => option.value === newStatus
//                             )}
//                             onChange={(option) => setNewStatus(option.value)}
//                             className="w-32 p-0"
//                           />
//                           <button
//                             onClick={() => handleStatusChange(booking._id)}
//                             className="p-[6px] bg-neutral-100 border rounded-lg"
//                           >
//                             <Image
//                               src={assets.correctIcon}
//                               alt="Save"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => {
//                               setUpdating(booking._id);
//                               setNewStatus(booking.status); // Set current status as initial value
//                             }}
//                             className="p-[6px] bg-neutral-100 border rounded-lg"
//                           >
//                             <Image
//                               src={assets.editIcon}
//                               alt="Edit"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(booking._id)}
//                             className="p-[6px] bg-neutral-100 border rounded-lg"
//                           >
//                             <Image
//                               src={assets.deleteIcon}
//                               alt="Delete"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="p-2 text-center border border-gray-300"
//                 >
//                   No bookings available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

// export default AllBookings;
