const express = require("express");
const { processPayment } = require("../controller/paymentCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/pay", authMiddleware, processPayment);

module.exports = router;
