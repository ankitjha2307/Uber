const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const { authUser, authCaptain } = require("../middlewares/auth.middleware"); // ✅ import both

// -------------------- USER ROUTES --------------------

// Create a ride
router.post(
  "/create",
  authUser,
  body("pickup").isString().isLength({ min: 3 }).withMessage("Invalid pickup"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "motorcycle"])
    .withMessage("Invalid vehicle type"),
  rideController.createRide
);

// Get fare
router.get(
  "/get-fare",
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  rideController.getFare
);

router.post(
  "/accept",
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.acceptRide
);

module.exports = router;
