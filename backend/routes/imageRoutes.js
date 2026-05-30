const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  uploadImage,
  getImages,
} = require("../controllers/imageController");

// MULTER STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// UPLOAD IMAGE
router.post(
  "/upload",
  upload.single("image"),
  uploadImage
);

// GET IMAGES
router.get("/", getImages);

module.exports = router;
