const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // тимчасова папка
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  getBooks,
  createBook,
  deleteBook,
  updateBook,
} = require("../controllers/booksControllers");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "books", // Папка в Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage: storage });

const router = express.Router();

router.get("/", getBooks);

router.post("/", upload.single("image"), createBook);

router.delete("/:id", deleteBook);

router.patch("/:id", updateBook);

module.exports = router;
