const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    plants: [
      {
        plant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Plant",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
