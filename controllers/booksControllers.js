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
  try {
    const { title, author, description, genre, pages, imageURL , price } = req.body;

    const newBook = new Book({
      title,
      author,
      description,
      genre,
      pages,
      price,
      imageURL: req.file ? req.file.path : imageURL, // Cloudinary image або посилання
    });

    await newBook.save();

    res.status(200).json(newBook);
  } catch (error) {
    console.error("Помилка при додаванні книги:", error);
    res.status(500).json({ error: "Помилка сервера" });
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

  try {
    const { title, author, description, genre, pages, imageURL , price } = req.body;

    const updatedFields = {
      title,
      author,
      description,
      genre,
      pages,
      price,
      imageURL: req.file ? req.file.path : imageURL,
    };

    const updatedBook = await Book.findOneAndUpdate(
      { _id: id },
      updatedFields,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: "Книжки не знайдено" });
    }

    res
      .status(200)
      .json({ message: "Дані про книжку змінено", book: updatedBook });
  } catch (error) {
    console.error("Помилка при оновленні книги:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

module.exports = {
  getBooks,
  createBook,
  deleteBook,
  updateBook,
};
