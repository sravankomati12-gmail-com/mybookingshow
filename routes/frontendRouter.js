const express = require("express");
const paymentModel = require("../models/paymentModel");
const frontendRoute = express.Router();
require("dotenv").config();
const url = { url: process.env.api_url };

frontendRoute.get("/", async (req, res) => {
  res.render("loginPage", url);
});
frontendRoute.get("/movies", (req, res) => {
  res.render("movies/moviesList", url);
});
frontendRoute.get("/movies1", (req, res) => {
  res.render("movies/moviesList1", url);
});
frontendRoute.get("/register", async (req, res) => {
  res.render("registerPage", url);
});
frontendRoute.get("/home", async (req, res) => {
  res.render("home");
});
frontendRoute.get("/changepassword", (req, res) => {
  res.render("changePassword", url);
});
frontendRoute.get("/userlist", (req, res) => {
  res.render("userListPage", url);
});
frontendRoute.get("/newticket", (req, res) => {
  res.render("tickets/newTicket", url);
});
frontendRoute.get("/ticketlist", (req, res) => {
  res.render("tickets/ticketList", url);
});
frontendRoute.get("/ticketbookedlist", (req, res) => {
  res.render("tickets/userBookedTicket", url);
});
frontendRoute.get("/paymentlist", (req, res) => {
  res.render("payments/paymentList", url);
});

frontendRoute.get("/newpayment", (req, res) => {
  res.render("payments/newPayment", url);
});
frontendRoute.get("/order/:id", async (req, res) => {
  const data = await paymentModel.findOne({ _id: req.params.id });
  // console.log(data);
  res.render("payments/payment", {
    order: data.paymentId,
    Id: data._id,
    amount: Number(data.amount) * 100,
    url,
  });
});

module.exports = frontendRoute;
