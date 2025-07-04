require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const booksRoute = require("./routes/booksRoute");
const checkApiKey = require("./middleware/chekApiKey");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

const allowedOrigins = ["https://admin-page-books.vercel.app/", "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("⛔ CORS: Доступ заборонено"));
      }
    },
    credentials: true,
  })
);

app.use("/api/books", checkApiKey, booksRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Під'єднано до Бази данних і сервер працює на порті ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
