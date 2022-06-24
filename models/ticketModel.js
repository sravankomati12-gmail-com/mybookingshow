const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  movieName: String,
  createdAt: { type: Date, default: Date.now },
  seatBookedNo: { type: Number, max: 30 },
  amount: Number,
  movieDate: Date,
  timmingSlot: {
    type: String,
    enum: ["10:00", "12:00", "2:00", "4:00", "6:00", "9:00"],
  },
  seatsAllocate: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "userInfo" },
});

module.exports = mongoose.model("ticketInfo", ticketSchema);
