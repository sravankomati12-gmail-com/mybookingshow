const express = require("express");
const index = express();
const userRoute = require("./userRouter");
const noToken = require("./noTokenRouter");
const movieRoute = require("./movieRouter");
const ticketRoute = require("./ticketRouter");
const paymentRoute = require("./paymentRouter");
const userMiddleware = require("../middleware/auth");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

index.use("/notoken", noToken);
index.use("/user", [auth, userMiddleware.authVerify], userRoute);
index.use("/movie", [auth, userMiddleware.authVerify], movieRoute);
index.use("/ticket", [auth, userMiddleware.authVerify], ticketRoute);
index.use("/payment", [auth, userMiddleware.authVerify], paymentRoute);

module.exports = index;
