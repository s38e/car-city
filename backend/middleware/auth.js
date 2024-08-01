const jwt = require("jsonwebtoken");
const Token = require("../models/token");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied" });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // التحقق من التوكن في قاعدة البيانات
    const storedToken = await Token.findOne({
      userId: decoded.userId,
      token: token,
    });

    if (!storedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", details: err.message });
  }
};

module.exports = auth;
