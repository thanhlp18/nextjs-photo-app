const commentController = require("../controller/commentController");

const router = require("express").Router();

// ADD COMMENT
router.post("/", commentController.addComment);

module.exports = router;
