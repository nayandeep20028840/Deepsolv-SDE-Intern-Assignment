const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema({
    page_id: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "SocialMediaUser", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Follower", FollowerSchema);
