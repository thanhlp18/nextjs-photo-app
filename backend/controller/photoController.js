const { Photo, Comment } = require("../model/model");
const BASE_API_URL = "https://nextjs-photo-app.onrender.com";

const photoController = {
  // ADD PHOTO
  addPhoto: async (req, res) => {
    try {
      const newPhoto = new Photo(req.body);
      console.log(req.file);
      if (req.file) {
        newPhoto.image = req.file.path;
      }
      const savedPhoto = await newPhoto.save();
      const cleanedPhoto = {
        id: savedPhoto._id,
        image: `${BASE_API_URL}/${savedPhoto.image}`,
        ownerName: savedPhoto.ownerName,
        ownerComment: savedPhoto.ownerComment,
        comments: await Promise.all(
          savedPhoto.comments.map(async (comment) => {
            const { _id, __v, photoId, ...commentData } = comment.toObject();
            return {
              id: _id,
              ...commentData,
            };
          })
        ),
      };
      res.status(200).json({ message: "Photo added", data: cleanedPhoto });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET ALL PHOTOS
  getAllPhotos: async (req, res) => {
    try {
      const photos = await Photo.find();
      // Change the response to include the image URL and comments count
      const processedPhotoData = await Promise.all(
        photos.map(async (photo) => {
          const commentsCount = photo.comments.length;
          const { comments, _id, ...photoDataWithoutComments } =
            photo.toObject(); // Remove the comments array
          return {
            id: photo._id,
            ...photoDataWithoutComments,
            image: `${BASE_API_URL}/${photo.image}`,
            commentsCount: commentsCount,
          };
        })
      );
      res.status(200).json({
        message: "Get all photos successfully",
        data: processedPhotoData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //GET A PHOTO
  getAPhoto: async (req, res) => {
    try {
      const photo = await Photo.findById(req.params.id).populate("comments");
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      const cleanedPhoto = {
        id: photo._id,
        image: `${BASE_API_URL}/${photo.image}`,
        ownerName: photo.ownerName,
        ownerComment: photo.ownerComment,
        comments: await Promise.all(
          photo.comments.map(async (comment) => {
            const { _id, __v, photoId, ...commentData } = comment.toObject();
            return {
              id: _id,
              ...commentData,
            };
          })
        ),
      };

      res.status(200).json({ message: "Get a photo", data: cleanedPhoto });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = photoController;
