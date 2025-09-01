const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // passenger
    captain: { type: mongoose.Schema.Types.ObjectId, ref: "Captain" }, // driver (assigned later)

    pickup: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
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

    otp: { type: String, select: false, required: true }, // ✅ required OTP
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
