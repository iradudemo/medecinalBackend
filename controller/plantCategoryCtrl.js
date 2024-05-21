const Category = require("../models/plantCategoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ErrorResponse = require("../utils/errorResponse.js");

const createCategory = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  const findCategory = await Category.findOne({ title });

  if (!findCategory) {
    try {
      const newCategory = await Category.create(req.body);
      res
        .status(201)
        .json({ message: "Category created successfully", data: newCategory });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } else {
    return next(new ErrorResponse(` ${title} Category is already exists`, 400));
  }
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const findCategory = await Category.findById(id);
  if (!findCategory) {
    return next(new ErrorResponse(` ${id} Category is not exists`, 400));
  } else {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res
        .status(200)
        .json({ updatedCategory, message: "Category updated successfully" });
    } catch (error) {
      throw new Error(error);
    }
  }
});
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const findCategory = await Category.findById(id);
  if (!findCategory) {
    return next(new ErrorResponse(`Category is not exists`, 400));
  } else {
    try {
      const deletedCategory = await Category.findByIdAndDelete(id);
      res
        .status(200)
        .json({ deletedCategory, message: "Category deleted successfully" });
    } catch (error) {
      throw new Error(error);
    }
  }
});
const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const findCategory = await Category.findById(id);
  if (!findCategory) {
    return next(new ErrorResponse(`Category is not exists`, 400));
  } else {
    try {
      const getaCategory = await Category.findById(id);
      res.status(200).json(getaCategory);
    } catch (error) {
      throw new Error(error);
    }
  }
});
const getallCategory = asyncHandler(async (req, res) => {
  try {
    const getallCategory = await Category.find();
    res.status(200).json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
};
