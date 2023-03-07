const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauce = require("../controllers/sauce");

router.get("/", auth, sauce.getAllSauce);
router.post("/", auth, multer, sauce.createSauce);
router.get("/:id", auth, sauce.getOneSauce);
router.delete("/:id", auth, sauce.deleteSauce);
router.put("/:id", auth, multer, sauce.modifySauce);
router.post("/:id/like", auth, sauce.likeSauce);

module.exports = router;
