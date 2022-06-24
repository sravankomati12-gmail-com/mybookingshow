const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expireIn: Number,
});
module.exports = mongoose.model("otpinfo", otpSchema);
