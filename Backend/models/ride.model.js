// models/ride.model.js
const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  captain: { type: mongoose.Schema.Types.ObjectId, ref: "Captain" },
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
  fare: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },
  duration: { type: Number },
  distance: { type: Number },
  paymentID: { type: String },
  orderID: { type: String },
  signature: { type: String },
});

module.exports = mongoose.model("Ride", rideSchema);
