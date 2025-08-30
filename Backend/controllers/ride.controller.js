const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const { getFare } = require("../service/ride.service");
const crypto = require("crypto");

function generateOtp(length = 4) {
  return crypto
    .randomInt(Math.pow(10, length - 1), Math.pow(10, length))
    .toString();
}

exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickup, destination, vehicleType } = req.body;
    const fares = await getFare(pickup, destination);

    if (!fares[vehicleType]) {
      return res
        .status(400)
        .json({ error: "Invalid vehicle type for this route" });
    }

    const otp = generateOtp();

    const ride = await rideModel.create({
      user: req.user._id,
      pickup,
      destination,
      otp,
      fare: fares[vehicleType],
    });

    res.status(201).json(ride);
  } catch (err) {
    next(err);
  }
};

exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickup, destination } = req.query;
    const fares = await getFare(pickup, destination);
    res.status(200).json(fares);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
