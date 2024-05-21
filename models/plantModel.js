const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var plantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
    },
    commonName: {
      type: String,
    },
    medicinalUse: {
      type: String,
    },
    partToUse: {
      type: String,
    },
    dosage: {
      type: String,
    },
    preparation: {
      type: String,
    },
    cautions: {
      type: String,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    tags: String,
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Plant", plantSchema);
