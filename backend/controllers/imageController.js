const Image = require("../models/Image");

// UPLOAD IMAGE
const uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;

    const image = new Image({
      name,
      imageUrl: `/uploads/${req.file.filename}`,
      folderId,
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

// GET IMAGES
const getImages = async (req, res) => {
  try {
    const images = await Image.find();

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

