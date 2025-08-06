const express = require("express");
const {
  getOrders,
  createOrder,
  getOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/ordersControllers");

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrder);
router.delete("/:id", deleteOrder);
router.patch("/:id", updateOrder);

module.exports = router;
