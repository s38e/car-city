const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// تعريف السكيما
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// تشفير كلمة المرور قبل الحفظ
userSchema.pre("save", async function (next) {
  const user = this;

  // إذا لم تكن كلمة المرور قد تم تعديلها، لا حاجة لتشفيرها
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// التحقق من كلمة المرور
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// التحقق من وجود البريد الإلكتروني بالفعل قبل إنشاء المستخدم
userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email });
};

// إنشاء النموذج من السكيما
const User = mongoose.model("User", userSchema);

module.exports = User;
