const rideModel = require("../models/ride.model");
const mapService = require("../service/maps.service");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and Destination are Required");
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const distanceKm = distanceTime.distance.value / 1000;
  const durationMin = distanceTime.duration.value / 60;

  const baseFares = { auto: 30, car: 50, motorcycle: 20 };
  const perKmRates = { auto: 10, car: 15, motorcycle: 8 };
  const perMinRates = { auto: 2, car: 3, motorcycle: 1.5 };

  return {
    auto:
      baseFares.auto +
      distanceKm * perKmRates.auto +
      durationMin * perMinRates.auto,
    car:
      baseFares.car +
      distanceKm * perKmRates.car +
      durationMin * perMinRates.car,
    motorcycle:
      baseFares.motorcycle +
      distanceKm * perKmRates.motorcycle +
      durationMin * perMinRates.motorcycle,
  };
}

exports.createRide = async (req, res, next) => {
  try {
    const { pickup, destination, vehicleType } = req.body;

    if (!pickup || !destination || !vehicleType) {
      return res.status(400).json({
        error: "All fields are required",
        missing: {
          pickup: !pickup,
          destination: !destination,
          vehicleType: !vehicleType,
        },
      });
    }

    const fares = await getFare(pickup, destination);

    const ride = await rideModel.create({
      user: req.user._id,
      pickup,
      destination,
      fare: fares[vehicleType],
    });

    res.status(201).json(ride);
  } catch (err) {
    next(err);
  }
};
