const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_API_KEY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
