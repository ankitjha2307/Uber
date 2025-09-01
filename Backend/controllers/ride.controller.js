const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const { getFare } = require("../service/ride.service");
const crypto = require("crypto");
const mapService = require("../service/maps.service");
const { sendMessageToSocket } = require("../socket");

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

    // Get fare
    const fares = await getFare(pickup, destination);

    // Get coordinates
    const pickupCoordinates = await mapService.getCoordinatesFromAddress(
      pickup
    );
    const destinationCoordinates = await mapService.getCoordinatesFromAddress(
      destination
    );

    // Validate vehicle type
    if (!fares[vehicleType]) {
      return res
        .status(400)
        .json({ error: "Invalid vehicle type for this route" });
    }

    // Generate OTP
    const otp = generateOtp();

    // ✅ Create ride first
    const ride = await rideModel.create({
      user: req.user._id,
      pickup: {
        address: pickup,
        lat: pickupCoordinates.lat,
        lng: pickupCoordinates.lng,
      },
      destination: {
        address: destination,
        lat: destinationCoordinates.lat,
        lng: destinationCoordinates.lng,
      },
      otp,
      fare: fares[vehicleType],
      status: "pending",
    });

    console.log("✅ New Ride Created:", ride); // ✅ backend terminal log

    // Search for captains within 2 km radius
    const radius = 2; // km
    const captainsInTheRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      radius
    );

    // Send ride details to all nearby captains
    captainsInTheRadius.forEach((captain) => {
      sendMessageToSocket(captain.socketId, {
        event: "new-ride",
        data: { ride },
      });
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
