const express = require("express");
const {
  createPlant,
  getaPlant,
  getAllPlants,
  updatePlant,
  deletePlant,
  addToWishlist,
  rating,
} = require("../controller/plantCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createPlant);

router.get("/:id", getaPlant);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updatePlant);
router.delete("/:id", authMiddleware, isAdmin, deletePlant);

router.get("/", getAllPlants);

module.exports = router;
