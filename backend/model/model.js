const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerComment: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo",
  },
});

let Comment = mongoose.model("Comment", commentSchema);
let Photo = mongoose.model("Photo", photoSchema);

module.exports = { Comment, Photo };
