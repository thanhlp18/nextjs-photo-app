const { Photo, Comment } = require("../model/model");

const commentController = {
  addComment: async (req, res) => {
    try {
      const newComment = new Comment(req.body);
      const savedComment = await newComment.save();

      if (req.body.photoId) {
        const photo = await Photo.findById(req.body.photoId);
        await photo.updateOne({ $push: { comments: savedComment._id } });
      }

      res.status(200).json({ message: "Comment added", data: savedComment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = commentController;
