const express = require("express");

const router = express.Router();

const {
  createFolder,
  getFolderSize,
  getFolders,
} = require("../controllers/folderController");

const authMiddleware = require("../middleware/authMiddleware");

// create folder
router.post("/create", authMiddleware, createFolder);

// get all folders
router.get("/", authMiddleware, getFolders);

// get folder size
router.get("/size/:folderId", authMiddleware, getFolderSize);

module.exports = router;