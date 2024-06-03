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
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "PCategory",
    },
    scientificName: {
      type: String,
      required: true,
    },
    commonName: {
      type: String,
      required: true,
    },
    medicinalUse: {
      type: [String],
      required: true,
    },
    sideEffect: {
      type: [String],
    },
    partToUse: {
      type: [String],
      required: true,
    },
    howToUse: {
      type: [String],
    },
    dosages: {
      adults: {
        type: [String],
      },
      children: {
        type: [String],
      },
      all: {
        type: [String],
      },
    },
    measurements: {
      type: [String],
    },
    cautions: {
      type: [String],
    },
    precautions: {
      type: [String],
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
