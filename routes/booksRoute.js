const express = require("express");
const upload = require("../middleware/upload");
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

router.patch("/:id", upload.single("image"), updateBook);

module.exports = router;
