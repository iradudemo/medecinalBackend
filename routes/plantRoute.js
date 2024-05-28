const express = require("express");
const {
  createPlant,
  getaPlant,
  getAllPlants,
  updatePlant,
  deletePlant,
  addToWishlist,
  rating,
  uploadImages,
} = require("../controller/plantCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, plantImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createPlant);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  plantImgResize,
  uploadImages
);

router.get("/:id", getaPlant);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updatePlant);
router.delete("/:id", authMiddleware, isAdmin, deletePlant);

router.get("/", getAllPlants);

module.exports = router;
