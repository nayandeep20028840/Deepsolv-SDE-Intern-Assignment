const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
    facebook_id: { type: String, required: true, unique: true }, // Facebook Platform ID
    username: { type: String, required: true, unique: true }, // boat.lifestyle
    name: { type: String, required: true }, // Boat Lifestyle
    url: { type: String, required: true }, // https://www.facebook.com/boat.lifestyle
    profile_pic: { type: String }, // Profile Image URL
    email: { type: String },
    website: { type: String },
    category: { type: String },
    followers: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    created_at: { type: Date }, // Page Creation Date
}, { timestamps: true });

module.exports = mongoose.model("Page", PageSchema);
