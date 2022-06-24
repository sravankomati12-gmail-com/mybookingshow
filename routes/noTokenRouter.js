const express = require("express");
const router = express.Router();
const user = require("../controllers/userControllers");
const authv = require("../middleware/auth");

router.post("/checkuser", user.addAndLoginUser);
router.post("/changepassword", user.chanagePassword);
router.post("/verifyotp", user.verifyOtp);

module.exports = router;
