const paymentModel = require("../models/paymentModel");
const ticketModel = require("../models/ticketModel");
const razorPay = require("razorpay");
require("dotenv").config();

const razorPayInstance = new razorPay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

module.exports = {
  addpayment: async (req, res) => {
    const { acountno, payopt, currency, timmingslot, username, ticket } =
      req.body;
    const checkTicket = await ticketModel.findOne({ _id: ticket });
    if (checkTicket) {
      razorPayInstance.orders
        .create({
          amount: checkTicket.amount * 100,
          currency: currency,
          receipt: "su001",
          payment_capture: "1",
        })
        .then(async (result) => {
          const data = await paymentModel.create({
            acountNo: acountno,
            paymentOpt: payopt,
            currency,
            userName: username,
            amount: checkTicket.amount,
            timmingSlot: timmingslot,
            ticket: checkTicket._id,
            paymentId: result.id,
          });
          res.json({ message: "Payment is done", details: data });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.json({ message: "This ticket id is not exist" });
    }
  },
  getAllPaymentList: async (req, res) => {
    const { page = 1 } = req.query;
    const data = await paymentModel
      .find()
      .skip(5 * page - 5)
      .limit(5);
    const count = await paymentModel.count();
    res.json({
      message: "List of payments",
      data,
      current: page,
      pages: Math.ceil(count / 5),
    });
  },
  getPaymentById: async (req, res) => {
    const data = await paymentModel
      .findById(req.query.id)
      .populate([{ path: "ticket", populate: { path: "createdBy" } }]);
    res.json({ message: "List of payments by id", data });
  },
  updatePaymentDetails: async (req, res) => {
    const { id, paymentId } = req.body;
    const data = await razorPayInstance.payments.fetch(paymentId);
    await paymentModel.findByIdAndUpdate(id, {
      paymentId,
      paymentOpt: data.method,
    });
    res.json({ message: "payment is done" });
  },
};
