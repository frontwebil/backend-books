const express = require("express");
const Book = require("../models/Book");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books: books });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  try {
    const book = await Book.create({
      title,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Книжки не знайдено" });
  }

  const book = await Book.findByIdAndDelete({ _id: id });

  if (!book) {
    return res.status(404).json({ error: "Книжки не знайдено" });
  }

  res.status(200).json({ message: "Книжку видалено", book });
});

module.exports = router;
