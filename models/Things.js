const mongoose = require("mongoose");

const SauceSchema = mongoose.Schema({
    userId: { type: String, require: true },
    name: { type: String, require: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: Number, required: true },
    heat: { type: Number, required: true, min: 1, max: 10 },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersLiked: { type: Number, required: true },
    usersLiked: [{ type: String, ref: "User" }],
    usersDisliked: [{ type: String, ref: "User" }],
});

module.exports = mongoose.model("Sauce", SauceSchema);
