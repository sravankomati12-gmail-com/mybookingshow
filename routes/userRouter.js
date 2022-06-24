const express = require("express");
const userControl = require("../controllers/userControllers");
const authv = require("../middleware/auth");
const userRouter = express.Router();

userRouter.post("/update", authv.userValidation, userControl.userUpdate);
userRouter.get("/list", userControl.userList);
userRouter.delete("/delete", userControl.userDelete);
userRouter.post("/forgot", userControl.forgotPassword);
userRouter.get("/getuserbyid", userControl.getUserbyid);

module.exports = userRouter;
