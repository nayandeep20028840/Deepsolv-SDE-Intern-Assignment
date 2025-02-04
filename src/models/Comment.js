const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Post Reference
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "SocialMediaUser" }, // Commenting User
    comment_id: { type: String, required: true, unique: true }, // Unique Comment ID
    text: { type: String, required: true },
    created_at: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);
