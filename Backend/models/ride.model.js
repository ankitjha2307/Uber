const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: "Captain" },

    pickup: {
      address: { type: String, required: true },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },

    destination: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

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

    otp: { type: String, select: false, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
