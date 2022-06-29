const express = require("express");
const paymentModel = require("../models/paymentModel");
const moviesInfo = require("../models/movieModel");
const pdf = require("html-pdf");
const fs = require("fs");
const qrcode = require("qrcode");
const { verify } = require("jsonwebtoken");
const userModel = require("../models/userModel");
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
    path: process.env.api_url,
  });
});
frontendRoute.get("/export", async (req, res) => {
  let options = {
    height: "11.25in",
    width: "8.5in",
    header: {
      height: "20mm",
    },
    footer: {
      height: "20mm",
    },
  };
  const data = await moviesInfo.find();

  res.render("pdfconvert", { data: data }, (err1, html) => {
    const path = Date.now() + "_report.pdf";
    pdf
      .create(html, options)
      .toFile("./public/export/" + path, function (err, result) {
        if (err) {
          console.log(err);
        }
        var dataFile = fs.readFileSync("./export/" + path);
        res.header("Content-Type", "application/pdf");
        res.send(dataFile);
      });
  });
});
frontendRoute.get("/qrcode", async (req, res) => {
  const id = verify(req.query.data, process.env.secretKey);
  const data = await userModel.findById(id.userid);
  const present = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    isAdmin: data.isAdmin,
    dob: String(data.dob).split("T")[0],
  };

  let img = await qrcode.toDataURL(JSON.stringify(present));

  res.render("qrCode", { img });
});
module.exports = frontendRoute;
