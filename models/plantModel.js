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
    partToUse: {
      type: [String],
      required: true,
    },
    howToUse: {
      type: [String],
    },
    dosages: {
      adults: {
        type: String,
      },
      children: {
        aged10to15: {
          type: String,
          // required: true,
        },
        aged6to9: {
          type: String,
          // required: true,
        },
        aged2to5: {
          type: String,
          // required: true,
        },
        aged1to2: {
          type: String,
          // required: true,
        },
        below1year: {
          type: String,
          // required: true,
        },
      },
    },
    measurements: {
      tablespoon: {
        type: String,
        // required: true,
      },
      dessertspoon: {
        type: String,
        // required: true,
      },
      teaspoon: {
        type: String,
        default: "",
        // required: true,
      },
      cup: {
        type: String,
        default: "",
        // required: true,
      },
      litre: {
        type: String,
        default: "",
        // required: true,
      },
    },
    cautions: {
      type: String,
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
