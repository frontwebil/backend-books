const Book = require("../models/Book");
const mongoose = require("mongoose");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books: books });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createBook = async (req, res) => {
  const { title, author, description, genre, pages, imageURL } = req.body;
  try {
    const book = await Book.create({
      title,
      author,
      description,
      genre,
      pages,
      imageURL,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Книжки не знайдено" });
  }

  const book = await Book.findByIdAndDelete({ _id: id });

  if (!book) {
    return res.status(404).json({ error: "Книжки не знайдено" });
  }

  res.status(200).json({ message: "Книжку видалено", book });
};

const updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Книжки не знайдено" });
  }

  const book = await Book.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!book) {
    return res.status(404).json({ error: "Книжки не знайдено" });
  }
  res.status(200).json({ message: "Данні про книжку зміненні", book });
};

module.exports = {
  getBooks,
  createBook,
  deleteBook,
  updateBook,
};
