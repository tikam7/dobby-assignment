const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  uploadImage,
  getImages,
} = require("../controllers/imageController");

const authMiddleware = require("../middleware/authMiddleware");

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
  authMiddleware,
  upload.single("image"),
  uploadImage
);

// GET IMAGES
router.get("/", authMiddleware, getImages);

module.exports = router;