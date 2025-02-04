const mongoose = require("mongoose");

const SocialMediaUserSchema = new mongoose.Schema({
    facebook_id: { type: String, required: true, unique: true }, // Facebook User ID
    name: { type: String, required: true },
    profile_pic: { type: String }, 
    following_pages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Page" }], // Pages this user follows
}, { timestamps: true });

module.exports = mongoose.model("SocialMediaUser", SocialMediaUserSchema);
