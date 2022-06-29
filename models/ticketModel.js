const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  movieName: String,
  createdAt: { type: Date, default: Date.now },
  seatBookedNo: { type: Number, max: 30 },
  amount: Number,
  movieDate: Date,
  timmingSlot: String,
  seatsAllocate: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "userInfo" },
});

module.exports = mongoose.model("ticketInfo", ticketSchema);
