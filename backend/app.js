const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const User = require("./models/userSchema");
const CarWashBooking = require("./models/carwashbookingSchema");
const auth = require("./middleware/auth");
const cache = require("./cache");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Token = require("./models/token");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["https://carcity.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// الاتصال بقاعدة البيانات
const dbUrl = process.env.MONGO_URI;
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err) => console.log(err));

//
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// مسار لإنشاء مستخدم جديد
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // التحقق من وجود البريد الإلكتروني بالفعل
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // إنشاء مستخدم جديد
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating user", details: err.message });
  }
});

// مسار تسجيل الدخول
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم بواسطة البريد الإلكتروني
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // التحقق من كلمة المرور
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // إنشاء التوكن
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // حفظ التوكن في قاعدة البيانات
    const newToken = new Token({ userId: user._id, token });
    await newToken.save();

    // حفظ التوكن في الكاش
    cache.set(user._id.toString(), token);

    // تضمين الـ role في الاستجابة
    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error("Login error:", err); // عرض الأخطاء في وحدة التحكم الخاصة بالخادم
    res.status(500).json({ error: "Error logging in", details: err.message });
  }
});

// مسار لجلب المستخدم الحالي
app.get("/current-user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching user", details: err.message });
  }
});

// مسار تسجيل الخروج
app.post("/logout", auth, (req, res) => {
  const userId = req.user.userId;
  cache.del(userId.toString());
  res.status(200).json({ message: "Logged out successfully" });
});

// دالة لحساب الرقم التسلسلي بناءً على اليوم
const getSerialNumberForDate = async (date) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const bookings = await CarWashBooking.find({
    startTime: { $gte: startOfDay, $lte: endOfDay },
  });

  return bookings.length + 1; // الرقم التسلسلي هو عدد الحجوزات في اليوم + 1
};

// مسار لإنشاء حجز
app.post("/book", auth, async (req, res) => {
  try {
    const { startTime, carDetails, washType, comment } = req.body;
    const userId = req.user.userId; // استخدم userId من التوكن

    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 45); // إضافة 45 دقيقة إلى وقت البداية

    // التحقق من أن اليوم ليس يوم سبت
    if (start.getDay() === 6) {
      return res.status(400).json({ message: "الحجز غير متاح في أيام السبت" });
    }

    // التحقق من أن الوقت ضمن الفترة المحددة
    if (start.getHours() < 0 || start.getHours() >= 22) {
      return res
        .status(400)
        .json({ message: "يجب أن يكون وقت الحجز بين الساعة 12 AM و 10 PM" });
    }

    // التحقق من وجود حجز في نفس الوقت
    const existingBooking = await CarWashBooking.findOne({
      $or: [{ startTime: { $lte: end }, endTime: { $gte: start } }],
    });

    if (existingBooking) {
      return res.status(400).json({ message: "الوقت المحدد محجوز بالفعل" });
    }

    // حساب الرقم التسلسلي
    const serialNumber = await getSerialNumberForDate(new Date(startTime));

    const booking = new CarWashBooking({
      userId,
      startTime: start,
      endTime: end,
      carDetails,
      washType,
      comment,
      status: "Waiting",
      serialNumber, // إضافة الرقم التسلسلي
    });

    await booking.save();

    res.status(201).json({ message: "تم الحجز بنجاح", booking });
  } catch (err) {
    res.status(500).json({ error: "خطأ في إنشاء الحجز", details: err.message });
  }
});

// مسار لجلب الحجوزات
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await CarWashBooking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching bookings", details: err.message });
  }
});

// مسار لجلب حجز
app.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await CarWashBooking.findById(req.params.id);
    res.status(200).json(booking);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching booking", details: err.message });
  }
});

// مسار لتحديث حالة الحجز
app.put("/bookings/:id", async (req, res) => {
  try {
    const booking = await CarWashBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating booking", details: err.message });
  }
});

// مسار لحذف الحجز
app.delete("/bookings/:id", async (req, res) => {
  try {
    const result = await CarWashBooking.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting booking", details: err.message });
  }
});

module.exports = app;
// -----------------------------------------------------------------------------------------------------------------
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const User = require("./models/userSchema");
// const CarWashBooking = require("./models/carwashbookingSchema");
// const auth = require("./middleware/auth");
// const cache = require("./cache");
// const jwt = require("jsonwebtoken");
// const app = express();
// const port = process.env.PORT || 5000;

// app.use(express.json());
// app.use(cors());

// const dbUrl =
//   "mongodb+srv://s____38e:S%40eedKhaled2583@learnexpress.rvworkw.mongodb.net/Car-City?retryWrites=true&w=majority&appName=LearnExpress";

// mongoose
//   .connect(dbUrl)
//   .then(() => {
//     app.listen(port, () => console.log(`Server started on port ${port}`));

//     console.log("MongoDB Connected...");
//   })
//   .catch((err) => console.log(err));

// // مسار لإنشاء مستخدم جديد
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // التحقق من وجود البريد الإلكتروني بالفعل
//     const existingUser = await User.findByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ message: "Email is already registered" });
//     }

//     // إنشاء مستخدم جديد
//     const user = new User({ name, email, password, role });
//     await user.save();

//     res.status(201).json({ message: "User created successfully", user });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error creating user", details: err.message });
//   }
// });

// // مسار تسجيل الدخول
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // البحث عن المستخدم بواسطة البريد الإلكتروني
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // التحقق من كلمة المرور
//     const isMatch = await user.isValidPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // إنشاء التوكن
//     const token = jwt.sign({ userId: user._id }, "your_jwt_secret");

//     // حفظ التوكن في الكاش
//     cache.set(user._id.toString(), token);

//     // تضمين الـ role في الاستجابة
//     res
//       .status(200)
//       .json({ message: "Login successful", token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ error: "Error logging in", details: err.message });
//   }
// });

// // مسار لجلب المستخدم الحالي
// app.get("/current-user", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ user });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error fetching user", details: err.message });
//   }
// });

// // مسار تسجيل الخروج
// app.post("/logout", auth, (req, res) => {
//   const userId = req.user.userId;
//   cache.del(userId.toString());
//   res.status(200).json({ message: "Logged out successfully" });
// });

// // مسار لإنشاء حجز
// app.post("/book", auth, async (req, res) => {
//   try {
//     const { startTime, carDetails, washType, comment } = req.body;
//     const userId = req.user.userId; // استخدم userId من التوكن

//     const start = new Date(startTime);
//     const end = new Date(start);
//     end.setMinutes(start.getMinutes() + 45); // إضافة 45 دقيقة إلى وقت البداية

//     // التحقق من أن اليوم ليس يوم سبت
//     if (start.getDay() === 6) {
//       return res
//         .status(400)
//         .json({ message: "Booking is not available on Saturdays" });
//     }

//     // التحقق من أن الوقت ضمن الفترة المحددة
//     if (start.getHours() < 0 || start.getHours() >= 22) {
//       return res
//         .status(400)
//         .json({ message: "Booking time must be between 12 AM and 10 PM" });
//     }

//     // التحقق من وجود حجز في نفس الوقت
//     const existingBooking = await CarWashBooking.findOne({
//       $or: [{ startTime: { $lte: end }, endTime: { $gte: start } }],
//     });

//     if (existingBooking) {
//       return res
//         .status(400)
//         .json({ message: "The selected time slot is already booked" });
//     }

//     const booking = new CarWashBooking({
//       userId,
//       startTime: start,
//       endTime: end,
//       carDetails,
//       washType,
//       comment,
//       status: "Waiting",
//     });

//     await booking.save();

//     res.status(201).json({ message: "Booking successful", booking });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error creating booking", details: err.message });
//   }
// });

// // مسار لجلب الحجوزات
// app.get("/bookings", async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.status(200).json(bookings);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error fetching bookings", details: err.message });
//   }
// });

// // مسار لجلب حجز
// app.get("/bookings/:id", async (req, res) => {
//   try {
//     const booking = await CarWashBooking.findById(req.params.id);
//     res.status(200).json(booking);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error fetching booking", details: err.message });
//   }
// });

// // مسار لتحديث حاله الحجز
// app.put("/bookings/:id", async (req, res) => {
//   try {
//     const booking = await CarWashBooking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(booking);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error updating booking", details: err.message });
//   }
// });

// //
// module.exports = app;
