const rideModel = require("../models/ride.model");
const { route } = require("../routes/rides.routes");
const mapService = require("../service/maps.service");

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

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !destination || !pickup || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = rideModel.create({
    user,
    pickup,
    destination,
    fare: fare[vehicleType],
  });

  return ride;
};
