const express = require("express");
const multer = require("multer");
const path = require("path");

//upload post image
const ImageStorage = multer.diskStorage({
  destination: "./public/productImage",
  filename: (req, file, callback) => {
    let extension = path.extname(file.originalname);
    callback(null, `${file.fieldname}-${Date.now()}${extension}`);
  },
});

const imageValidation = (req, file, cb, res) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Images can only be uploaded!!!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: ImageStorage,
  fileFilter: imageValidation,
});

const uploadRoute = express.Router();
uploadRoute.route("/").post(upload.single("productImage"), (req, res) => {
  res.json(req.file);
});

module.exports = uploadRoute;
