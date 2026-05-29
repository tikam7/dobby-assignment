const Image = require("../models/Image");

// UPLOAD IMAGE
const uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;

    const userId = req.user.id;

    const image = new Image({
      name,
      imageUrl: req.file.path,
      folderId,
      userId,
      size: req.file.size,
    });

    await image.save();

    res.status(201).json({
      message: "Image uploaded successfully",
      image,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER IMAGES
const getImages = async (req, res) => {
  try {
    const images = await Image.find({
      userId: req.user.id,
    });

    res.status(200).json(images);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  getImages,
};