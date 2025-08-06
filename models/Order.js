const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    delivery: {
      type: String,
      required: true,
    },
    books: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      enum: ["в обробці", "підтвердженно" , "потребує уточнень" , "зазнало змін" , "прямує до вас", "скасовано" , "отримано"],
      required: true,
    },
    statusMessage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
