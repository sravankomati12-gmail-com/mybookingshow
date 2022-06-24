const express = require("express");
const paymentModel = require("../models/paymentModel");
const frontendRoute = express.Router();

frontendRoute.get("/", async (req, res) => {
  res.render("loginPage");
});
frontendRoute.get("/movies", (req, res) => {
  res.render("movies/moviesList");
});
frontendRoute.get("/movies1", (req, res) => {
  res.render("movies/moviesList1");
});
frontendRoute.get("/register", async (req, res) => {
  res.render("registerPage");
});
frontendRoute.get("/home", async (req, res) => {
  res.render("home");
});
frontendRoute.get("/changepassword", (req, res) => {
  res.render("changePassword");
});
frontendRoute.get("/userlist", (req, res) => {
  res.render("userListPage");
});
frontendRoute.get("/newticket", (req, res) => {
  res.render("tickets/newTicket");
});
frontendRoute.get("/ticketlist", (req, res) => {
  res.render("tickets/ticketList");
});
frontendRoute.get("/ticketbookedlist", (req, res) => {
  res.render("tickets/userBookedTicket");
});
frontendRoute.get("/paymentlist", (req, res) => {
  res.render("payments/paymentList");
});

frontendRoute.get("/newpayment", (req, res) => {
  res.render("payments/newPayment");
});
frontendRoute.get("/order/:id", async (req, res) => {
  const data = await paymentModel.findOne({ _id: req.params.id });
  // console.log(data);
  res.render("payments/payment", {
    order: data.paymentId,
    Id: data._id,
    amount: Number(data.amount) * 100,
  });
});

module.exports = frontendRoute;
