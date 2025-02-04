const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    page_id: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true }, // Page Reference
    post_id: { type: String, required: true, unique: true }, // Unique Post ID
    content: { type: String }, // Text Content of the Post
    media_url: { type: String }, // Image/Video URL (if any)
    likes: { type: Number, default: 0 }, 
    comments_count: { type: Number, default: 0 }, 
    created_at: { type: Date, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
