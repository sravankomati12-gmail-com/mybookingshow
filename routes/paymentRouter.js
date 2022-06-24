const express = require("express");
const paymentCont = require("../controllers/paymentController");
const { paymentValidation } = require("../middleware/auth");
const paymentRouter = express.Router();

paymentRouter.post("/addpayment", paymentValidation, paymentCont.addpayment);
paymentRouter.get("/paymentList", paymentCont.getAllPaymentList);
paymentRouter.get("/getpaymentbyid", paymentCont.getPaymentById);
paymentRouter.post("/paymentupdate", paymentCont.updatePaymentDetails);

module.exports = paymentRouter;
