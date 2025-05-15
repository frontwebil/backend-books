const Book = require("../models/Book");
const mongoose = require("mongoose");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books: books });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createBook = async (req, res) => {
  const { title, author, description, genre, pages } = req.body;
  const file = req.file;

  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    if (!file) {
      return res.status(400).json({ error: "Зображення не завантажено" });
    }

    const result = await cloudinary.uploader.upload(file.path);
    fs.unlinkSync(file.path); // видаляємо файл з локального диска

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      pages,
      imageURL: result.secure_url, // використовуємо URL з Cloudinary
    });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
