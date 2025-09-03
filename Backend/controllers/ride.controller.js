const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const { getFare } = require("../service/ride.service");
const crypto = require("crypto");
const mapService = require("../service/maps.service");
const { sendMessageToSocket } = require("../socket");
const { log } = require("console");

function generateOtp(length = 4) {
  return crypto
    .randomInt(Math.pow(10, length - 1), Math.pow(10, length))
    .toString();
}

exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { pickup, destination, vehicleType } = req.body;

    const fares = await getFare(pickup, destination);

    const pickupCoordinates = await mapService.getCoordinatesFromAddress(
      pickup
    );
    const destinationCoordinates = await mapService.getCoordinatesFromAddress(
      destination
    );

    if (!fares[vehicleType])
      return res.status(400).json({ error: "Invalid vehicle type" });

    const otp = generateOtp();

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

    console.log("New Ride Created", ride);

    // Send ride to nearby captains
    // Send ride to nearby captains
    const radius = 2; // km
    const captainsInTheRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      radius
    );

    captainsInTheRadius.forEach((captain) => {
      // ✅ FIX: pass event and message separately
      sendMessageToSocket(captain.socketId, "new-ride", ride);
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
