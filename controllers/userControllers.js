const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const mail = require("../config/email");
const { sign } = require("jsonwebtoken");
const otpmodel = require("../models/otpmodel");
require("dotenv").config();

module.exports = {
  addAndLoginUser: async (req, res) => {
    try {
      const { name, email, password, phone, dob, gender } = req.body;
      const checkEmail = await userModel.findOne({ email });
      if (checkEmail) {
        const checkPaswsword = await bcrypt.compare(
          password,
          checkEmail.password
        );
        if (checkPaswsword) {
          if (!checkEmail.isDeleted) {
            const token = sign(
              { userid: checkEmail._id },
              process.env.secretKey,
              {
                expiresIn: "5h",
              }
            );
            res.json({
              userName: checkEmail.name,
              admin: checkEmail.isAdmin,
              token: `Bearer ${token}`,
              message: "You are now login successfully",
            });
          } else {
            res.json({
              error: "Your not active please contact to admin",
            });
          }
        } else {
          res.json({
            error: "This email exists but the password is incorrect",
          });
        }
      } else {
        if (name != undefined) {
          const genaratePassword = await bcrypt.hash(password, 10);
          const data = await userModel.create({
            name,
            email,
            password: genaratePassword,
            phone,
            dob,
            gender,
          });
          const token = sign({ userid: data._id }, process.env.secretKey, {
            expiresIn: "5h",
          });
          res.json({
            userName: data.name,
            admin: data.isAdmin,
            token: `Bearer ${token}`,
            message: "You are now login successfully",
          });
        } else {
          res.json({ error: "name must be define" });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  getUserbyid: async (req, res) => {
    try {
      const checkUser = await userModel.findById(req.query.id);
      if (checkUser) {
        res.json({ message: "Get user deatails By id", data: checkUser });
      } else {
        res.json({ message: "This user id is not exist" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  userList: async (req, res) => {
    try {
      const { skipNo, fetchNo } = req.query;

      if (
        (skipNo == "" && fetchNo == "") ||
        (skipNo === undefined && fetchNo === undefined)
      ) {
        const data = await userModel.find().skip(0).limit(10);
        res.json({ message: "List of users", data });
      } else {
        const data = await userModel.find().skip(skipNo).limit(fetchNo);
        res.json({ message: "List of users", data });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  userUpdate: async (req, res) => {
    try {
      const { name, email, password, phone, dob, gender, id, isDeleted } =
        req.body;
      const checkUser = await userModel.findById(id);
      if (checkUser) {
        const genaratePassword = await bcrypt.hash(password, 10);
        await userModel.findByIdAndUpdate(
          { _id: id },
          {
            name,
            email,
            password: genaratePassword,
            phone,
            dob,
            gender,
            isDeleted,
          }
        );
        res.json({ message: "This user details is updated" });
      } else {
        res.json({ message: "This user id is not exist" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  userDelete: async (req, res) => {
    try {
      const checkUser = await userModel.findById(req.query.id);
      if (checkUser) {
        await userModel.findByIdAndUpdate(checkUser._id, { isDeleted: true });
        res.json({ message: "This user is deleted" });
      } else {
        res.json({ message: "This user id is not exist" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (email != "") {
        const data = await userModel.findOne({ email });
        if (data) {
          const genaratePassword = await bcrypt.hash(newPassword, 10);
          await userModel.findOneAndUpdate(
            { email },
            { password: genaratePassword }
          );
          res.json({ message: "Password is updated" });
        } else {
          res.json({ message: "This email is not exist" });
        }
      } else {
        res.json({ message: "Email and newPassword are not empty" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },
  chanagePassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (email) {
        const checkEmail = await userModel.findOne({ email });
        if (checkEmail) {
          let otpCode = Math.floor(Math.random() * 100000 + 1);
          checkEmailExist = await otpmodel.findOne({ email });
          if (checkEmailExist) {
            await otpmodel.findByIdAndUpdate(checkEmailExist._id, {
              otp: otpCode,
              expiresIn: new Date().getTime() + 300 * 1000,
            });
          } else {
            await otpmodel.create({
              email,
              otp: otpCode,
              expiresIn: new Date().getTime() + 300 * 1000,
            });
          }
          mail(email, otpCode);
          res.json({ message: "Otp is sended to this email" });
        } else {
          res.json({ message: "This email is not exist please register" });
        }
      } else {
        res.json({ message: "Email is required" });
      }
    } catch (error) {
      console.log(error.message);
      res.json({ message: "Email should be define" });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      console.log(new Date().getTime() + 300 * 1000);
      const { email, otp, password } = req.body;
      if (email != "" || otp != "" || password != "") {
        const checkEmail = await otpmodel.findOne({ email });
        if (checkEmail) {
          if (checkEmail.otp == otp) {
            const genaratePassword = await bcrypt.hash(password, 10);
            await userModel.findOneAndUpdate(email, {
              password: genaratePassword,
            });
            await otpmodel.findByIdAndDelete(checkEmail._id);
            res.json({ message: "password is changed" });
          } else {
            res.json({ message: "Otp is invalid" });
          }
        } else {
          res.json({ message: "Email is invalid" });
        }
      } else {
        res.json({ message: "Fields not be empty" });
      }
    } catch (error) {
      // console.log(error.message);
      res.json({ message: "Fields should be  define" });
    }
  },
};
