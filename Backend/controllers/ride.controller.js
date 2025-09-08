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

    console.log(typeof pickupCoordinates.lat);

    const ride = await rideModel.create({
      user: req.user._id,
      pickup: {
        address: pickup,
        location: {
          type: "Point",
          coordinates: [pickupCoordinates.lng, pickupCoordinates.lat],
        },
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

    const rideWithUser = await ride.populate("user", "name email phone");

    const rideForCaptain = rideWithUser.toObject();
    delete rideForCaptain.otp;

    console.log("New Ride Created", rideWithUser);

    const radius = 5;
    const captainsInTheRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      radius
    );

    captainsInTheRadius.forEach((captain) => {
      sendMessageToSocket(captain.socketId, "ride-request", rideWithUser);
    });

    res.status(201).json(rideWithUser);
  } catch (err) {
    next(err);
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const { rideId, captainId } = req.body;

    if (!rideId || !captainId)
      return res.status(400).json({ message: "rideId & captainId required" });

    const ride = await rideModel
      .findByIdAndUpdate(
        rideId,
        { status: "accepted", captain: captainId },
        { new: true }
      )
      .populate("user", "fullname email phone socketId")
      .populate("captain", "fullname email vehicle");

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // ✅ Send full ride object including OTP
    if (ride.user?.socketId) {
      sendMessageToSocket(ride.user.socketId, "rideAccepted", ride.toObject());
    }

    res.status(200).json({ message: "Ride accepted", ride });
  } catch (err) {
    console.error("❌ Error in acceptRide:", err);
    res.status(500).json({ message: "Server error" });
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

exports.verifyOtp = async (req, res) => {
  try {
    const { rideId, enteredOtp } = req.body;
    const ride = await rideModel.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.otp !== enteredOtp)
      return res.status(400).json({ message: "Invalid OTP" });

    ride.status = "ongoing";
    await ride.save();

    res.status(200).json({ message: "OTP verified, ride started", ride });
  } catch (err) {
    console.error("❌ Error in verifyOtp:", err);
    res.status(500).json({ message: "Server error" });
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
