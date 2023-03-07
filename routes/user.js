const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const loginLimit = require("../middleware/RateLimite");

router.post("/signup", userCtrl.signup);
router.post("/login", loginLimit, userCtrl.login);
module.exports = router;
