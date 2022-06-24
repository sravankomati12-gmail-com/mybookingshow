const ticketModel = require("../models/ticketModel");

let totalSeats = 100;

module.exports = {
  newTicket: async (req, res) => {
    try {
      const { name, seats, moviedate } = req.body;
      if (totalSeats != 0) {
        totalSeats -= seats;
        const amount = seats * 80;
        var result = [];
        var ts = String(new Date().getTime());
        for (var i = 0; i < seats; i += 1) {
          result.push(Number(ts.substr(i, 2)).toString(36));
        }
        const data = await ticketModel.create({
          movieName: name,
          seatBookedNo: seats,
          amount,
          seatsAllocate: result,
          movieDate: moviedate,
          createdBy: req.user._id,
        });
        res.json({
          message: "This movie ticket is booked",
          ticket: `Avalable ticket is ${totalSeats}`,
          data,
        });
      } else {
        res.json({
          message:
            "No ticket is available ,all ticket are booked try again later",
        });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  ticketbookedList: async (req, res) => {
    try {
      const { skipNo, fetchNo } = req.query;
      if (
        (skipNo == "" && fetchNo == "") ||
        (skipNo === undefined && fetchNo === undefined)
      ) {
        const data = await ticketModel
          .find({ createdBy: req.user._id })
          .skip(0)
          .limit(10);
        res.json({ message: "List of  tickets you booked", data });
      } else {
        const data = await ticketModel
          .find({ createdBy: req.user._id })
          .skip(skipNo)
          .limit(fetchNo);
        res.json({ message: "list of  tickets you booked", data });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  ticketList: async (req, res) => {
    try {
      const { skipNo, fetchNo } = req.query;
      if (
        (skipNo == "" && fetchNo == "") ||
        (skipNo === undefined && fetchNo === undefined)
      ) {
        const data = await ticketModel
          .find()
          .populate("createdBy")
          .skip(0)
          .limit(10);
        res.json({ message: "List of  tickets  user booked", data });
      } else {
        const data = await ticketModel
          .find()
          .populate("createdBy")
          .skip(skipNo)
          .limit(fetchNo);
        res.json({ message: "List of  tickets  user booked", data });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  ticketDelete: async (req, res) => {
    try {
      await ticketModel.findByIdAndDelete(req.query.id);
      res.json({ message: "This ticket is deleted" });
    } catch (error) {
      res.json({ message: error.message });
    }
  },
};
