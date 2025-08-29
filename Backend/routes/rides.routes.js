const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const { authUser } = require("../middlewares/auth.middleware");

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

module.exports = router;
