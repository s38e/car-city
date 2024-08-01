const mongoose = require("mongoose");

const token = new mongoose.Schema({
  userId: String,
  token: String,
  createdAt: { type: Date, expires: "1d", default: Date.now },
});

const Token = mongoose.model("token", token);

module.exports = Token;
