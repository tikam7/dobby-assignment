const express = require("express");

const router = express.Router();

const Folder = require("../models/Folder");
const Image = require("../models/Image");

// CREATE FOLDER
router.post("/create", async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    const folder = await Folder.create({
      name,
      parentFolder: parentFolder || null,
    });

    res.json(folder);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL FOLDERS
router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find();

    res.json(folders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// GET FOLDER SIZE
router.get("/size/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;

    const images = await Image.find({
      folderId,
    });

    let totalSize = 0;

    images.forEach((image) => {
      totalSize += image.size;
    });

    res.json({
      folderSize: totalSize,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;

