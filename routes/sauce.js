const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauce = require("../controllers/sauce");

router.get("/sauces", auth, sauce.getAllThing);

module.exports = router;
