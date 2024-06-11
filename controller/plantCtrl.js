const Plant = require("../models/plantModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

const createPlant = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newPlant = await Plant.create(req.body);
    res.status(200).json(newPlant);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePlant = asyncHandler(async (req, res) => {
  const id = req.params;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatePlant = await Plant.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    res.status(200).json(updatePlant);
  } catch (error) {
    throw new Error(error);
  }
});

const deletePlant = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deletePlant = await Plant.findOneAndDelete({ _id: id });
    if (!deletePlant) {
      return res.status(404).json({ message: "Plant not found" }); // Handle the case where the plant is not found
    }
    res
      .status(200)
      .json({ message: "Plant deleted successfully", deletePlant });
  } catch (error) {
    throw new Error(error);
  }
});

const getaPlant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findPlant = await Plant.findById(id);
    res.status(200).json(findPlant);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllPlants = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Plant.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Search
    // if (req.query.search) {
    //   const searchFields = [
    //     "title",
    //     "description",
    //     "medicinalUse",
    //     "scientificName",
    //     "commonName",
    //     "sideEffect",
    //     "category",
    //   ]; // fields to search against
    //   const searchQuery = {
    //     $or: searchFields.map((field) => ({
    //       [field]: { $regex: req.query.search, $options: "i" },
    //     })),
    //   };
    //   query = query.find(searchQuery);
    // }
    // Search by starting letter in title
    if (req.query.search) {
      const searchQuery = {
        title: { $regex: `^${req.query.search}`, $options: "i" },
      };
      query = query.find(searchQuery);
    }

    // General search term across multiple fields
    if (req.query.searchTerm) {
      const searchFields = [
        "title",
        "description",
        "medicinalUse",
        "scientificName",
        "commonName",
        "sideEffect",
        "category",
      ];
      const searchTerm = req.query.searchTerm;
      const searchQuery = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      query = query.find(searchQuery);
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const plantCount = await Plant.countDocuments();
      if (skip >= plantCount) throw new Error("This Page does not exists");
    }
    const plant = await query;
    res.status(200).json(plant);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.status(200).json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.status(200).json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const plant = await Plant.findById(prodId);
    let alreadyRated = plant.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Plant.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const ratePlant = await Plant.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Plant.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalPlant = await Plant.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ data: finalPlant, message: "Rating added successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);

      urls.push(newPath);
    }

    const findPlant = await Plant.findById(id);

    if (!findPlant) {
      throw new Error("Plant not found");
    }

    const updatedImages = [...findPlant.images, ...urls.map((file) => file)];

    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      {
        images: updatedImages,
      },
      { new: true }
    );
    res.status(200).json(updatedPlant);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createPlant,
  getaPlant,
  getAllPlants,
  updatePlant,
  deletePlant,
  addToWishlist,
  rating,
  uploadImages,
};
