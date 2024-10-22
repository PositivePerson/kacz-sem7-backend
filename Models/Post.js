const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 1000
    },
    photo: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []  // Ensure this field exists in your schema
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", PostSchema);
