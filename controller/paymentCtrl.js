const axios = require("axios");
const Payment = require("../models/PaymentModel");
const {
  clientId,
  clientSecret,
  authUrl,
  paymentUrl,
} = require("../config/paypack");

const getToken = async () => {
  const response = await axios.post(authUrl, {
    client_id: clientId,
    client_secret: clientSecret,
  });

  return response.data.access;
};

const processPayment = async (req, res) => {
  const { amount, number, plantId } = req.body;
  const { _id } = req.user;
  const payment = new Payment({
    userId: _id,
    amount,
    plantId,
    number,
    transactionId: `txn_${new Date().getTime()}`,
  });

  try {
    await payment.save();

    const token = await getToken();

    const response = await axios.post(
      "https://payments.paypack.rw/api/transactions/cashin",
      {
        amount,
        number,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    payment.status = response.data.status;
    payment.ref = response.data.ref;
    payment.transactionId =
      response.data.transactionId || payment.transactionId;
    await payment.save();

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
};
