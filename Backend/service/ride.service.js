const rideModel = require("../models/ride.model");
const { route } = require("../routes/rides.routes");
const mapService = require("../service/maps.service");
const crypto = require("crypto");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and Destination are Required");
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const { distance, duration } = distanceTime;

  // Example fare calculation logic (values can be adjusted as needed)
  const baseFares = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };
  const perKmRates = {
    auto: 10,
    car: 15,
    motorcycle: 8,
  };
  const perMinRates = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  const fares = {
    auto:
      baseFares.auto +
      (distanceTime.distance.value / 1000) * perKmRates.auto +
      duration * perMinRates.auto,
    car:
      baseFares.car +
      (distanceTime.distance.value / 1000) * perKmRates.car +
      duration * perMinRates.car,
    motorcycle:
      baseFares.motorcycle +
      (distanceTime.distance.value / 1000) * perKmRates.motorcycle +
      duration * perMinRates.motorcycle,
  };

  return fares;
}

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

module.exports.createRide = async ({
  captain,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!captain || !destination || !pickup || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const otp = getOtp(4);
  console.log("Generated OTP:", otp);

  const ride = await rideModel.create({
    captain, // ✅ schema expects this
    pickup,
    destination,
    otp, // ✅ required field
    fare: fare[vehicleType],
  });

  return ride;
};
eh;
