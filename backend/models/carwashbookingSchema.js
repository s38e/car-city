const mongoose = require("mongoose");

// نموذج الحجز مع إضافة الدور
const carwashbookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  carDetails: {
    type: String,
    required: true,
  },
  washType: {
    type: String,
    enum: ["external", "internal", "both"],
    required: true,
  },
  comment: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Waiting", "Wash", "Done"],
    default: "Waiting",
  },
  serialNumber: {
    type: Number,
    required: true,
  },
});

const Booking = mongoose.model("Car-Wash-Booking", carwashbookingSchema);

// const mongoose = require("mongoose");

// const carwashbookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   startTime: {
//     type: Date,
//     required: true,
//   },
//   endTime: {
//     type: Date,
//     required: true,
//   },
//   carDetails: {
//     type: String,
//     required: true,
//   },
//   washType: {
//     type: String,
//     enum: ["external", "internal", "both"],
//     required: true,
//   },
//   comment: {
//     type: String,
//     default: "",
//   },
//   status: {
//     type: String,
//     enum: ["Waiting", "Wash", "Done"],
//     default: "Waiting",
//   },
//   serialNumber: {
//     type: Number,
//     required: true,
//   },
// });

// const Booking = mongoose.model("Car-Wash-Booking", carwashbookingSchema);

module.exports = Booking;
