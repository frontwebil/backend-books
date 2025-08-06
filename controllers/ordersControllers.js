require("dotenv").config();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

// res.status(404).json({ error: error.message });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_KEY_PASSWORD,
  },
});

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders: orders });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Замовлення не знайдено" });
  }
  try {
    const orderData = await Order.findById(id);

    res.status(200).json({ order: orderData });
  } catch (error) {
    console.error("error:", error);

    res.status(404).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { name, surname, tel, mail, address, comment, delivery, books } =
      req.body;

    const newOrder = new Order({
      name,
      surname,
      tel,
      mail,
      address,
      comment,
      delivery,
      books,
      status: "в обробці",
      statusMessage: "",
    });

    await newOrder.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: mail,
      subject: "Ваше замовлення прийнято!",
      text: `Дякуємо за замовлення! Ваш ID замовлення: ${newOrder._id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Помилка надсилання email:", error);
      } else {
        console.log("Лист надіслано:", info.response);
      }
    });

    res.status(200).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Замовлення не знайдено" });
  }

  const order = await Order.findByIdAndDelete({ _id: id });

  if (!order) {
    return res.status(404).json({ error: "Замовлення не знайдено" });
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: order.mail,
    subject: `Замовлення скасовано та видалено!`,
    html: `<p>${order.name} ${order.surname} ваше замовлення було скасовано і видалено!</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Помилка надсилання email:", error);
    } else {
      console.log("Лист надіслано:", info.response);
    }
  });

  res.status(200).json({ message: "Замовлення видалено", order });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Замовлення не знайдено" });
  }
  try {
    const {
      name,
      surname,
      tel,
      mail,
      address,
      comment,
      delivery,
      books,
      status,
      statusMessage,
    } = req.body;
    const updatedFields = {
      name,
      surname,
      tel,
      mail,
      address,
      comment,
      delivery,
      books,
      status,
      statusMessage,
    };

    const oldOrder = await Order.findById(id);
    if (!oldOrder) {
      return res.status(404).json({ error: "Замовлення не знайдено" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      updatedFields,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Замовлення не знайдено" });
    }

    const statusChanged = oldOrder.status !== status;
    const messageChanged = oldOrder.statusMessage !== statusMessage;

    if (statusChanged || messageChanged) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: updatedOrder.mail,
        subject: `Ваше замовлення ${updatedOrder.status}!`,
        html: `<p><strong>${updatedOrder.statusMessage}</strong></p> </br>
         <p>id замовлення: <em>${updatedOrder._id}</em></p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Помилка надсилання email:", error);
        } else {
          console.log("Лист надіслано:", info.response);
        }
      });
    }

    res
      .status(200)
      .json({ message: "Данні про замовлення оновленно", order: updatedOrder });
  } catch (error) {
    console.error("Помилка при оновленні замовлення", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  getOrder,
  deleteOrder,
  updateOrder,
};
