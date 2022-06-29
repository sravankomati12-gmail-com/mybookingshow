const express = require("express");
const router = express.Router();
const user = require("../controllers/userControllers");
const movies = require("../controllers/movieController");

router.post("/checkuser", user.addAndLoginUser);
router.post("/changepassword", user.chanagePassword);
router.post("/verifyotp", user.verifyOtp);
router.post("/upload", movies.uploadExcelSheet);

module.exports = router;
