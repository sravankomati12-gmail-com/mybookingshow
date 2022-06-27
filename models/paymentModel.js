const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  acountNo: String,
  paymentOpt: { type: String, default: null },
  currency: String,
  amount: Number,
  timmingSlot: String,
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "ticketInfo" },
  userName: String,
  createdAt: { type: Date, default: Date.now },
  paymentId: String,
});

module.exports = mongoose.model("paymentInfo", paymentSchema);
