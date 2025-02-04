const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
    page_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Page', 
        required: true 
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    followed_at: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Following', followingSchema);
