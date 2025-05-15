const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // тимчасова папка
const {
  getBooks,
  createBook,
  deleteBook,
  updateBook,
} = require("../controllers/booksControllers");

const router = express.Router();

router.get("/", getBooks);

router.post("/", upload.single("image"), createBook);

router.delete("/:id", deleteBook);

router.patch("/:id", updateBook);

module.exports = router;
