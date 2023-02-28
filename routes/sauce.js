const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauce = require("../controllers/sauce");

router.get("/sauces", auth, sauce.getAllSauce);
router.post("/sauces", auth, multer, sauce.createSauce);
router.get("/sauces/:id", auth, sauce.getOneThing);
router.delete("/sauces/:id", auth, sauce.deleteThing);

module.exports = router;
