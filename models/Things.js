const mongoose = require("mongoose");
const User = require("../models/user");

const SauceSchema = mongoose.Schema({
    userId: { type: String, require: true },
    name: { type: String, require: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true, min: 1, max: 10 },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersLiked: [{ type: String, ref: "User" }],
    usersDisliked: [{ type: String, ref: "User" }],
});

module.exports = mongoose.model("Sauce", SauceSchema);
