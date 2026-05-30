const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },

userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);