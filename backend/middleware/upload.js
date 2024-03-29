const path = require("path");
const multer = require("multer");
const fs = require("fs");
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = "D:/code/nextjs-photo-app/backend/uploads";
//     // Create the directory if it doesn't exist
//     fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file.mimetype);
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      console.log("Only .png, .jpg and .jpeg format allowed!");
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 4,
  },
});

module.exports = upload;
