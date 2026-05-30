const Folder = require("../models/Folder");
const Image = require("../models/Image");

// CREATE FOLDER
const createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    const folder = new Folder({
      name,
      parentFolder: parentFolder || null,
    });

    await folder.save();

    res.status(201).json({
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// CALCULATE FOLDER SIZE
const calculateFolderSize = async (folderId) => {
  let totalSize = 0;

  // get images in current folder
  const images = await Image.find({ folderId });

  for (let image of images) {
    totalSize += image.size;
  }

  // get child folders
  const childFolders = await Folder.find({
    parentFolder: folderId,
  });

  // recursively calculate child folder sizes
  for (let child of childFolders) {
    const childSize = await calculateFolderSize(child._id);

    totalSize += childSize;
  }

  return totalSize;
};

// GET FOLDER SIZE
const getFolderSize = async (req, res) => {
  try {
    const { folderId } = req.params;

    const totalSize = await calculateFolderSize(folderId);

    res.status(200).json({
      folderSize: totalSize,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL FOLDERS
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find();

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFolder,
  getFolderSize,
  getFolders,
};
