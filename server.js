require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const booksRoute = require("./routes/booksRoute");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/books", booksRoute);

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
