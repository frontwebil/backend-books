const express = require("express");

const {
  getBooks,
  createBook,
  deleteBook,
  updateBook,
} = require("../controllers/booksControllers");

const router = express.Router();

router.get("/", getBooks);

router.post("/", createBook);

router.delete("/:id", deleteBook);

router.patch("/:id", updateBook);

module.exports = router;
