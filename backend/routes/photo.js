const photoController = require("../controller/photoController");
const upload = require("../middleware/upload");
const router = require("express").Router();

// ADD PHOTO
router.post("/", upload.single("image"), photoController.addPhoto);

// GET ALL PHOTOS
router.get("/", photoController.getAllPhotos);

// GET A PHOTO
router.get("/:id", photoController.getAPhoto);

module.exports = router;
