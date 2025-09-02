const axios = require("axios");
const captianModel = require("../models/captian.model");

// Get coordinates from address
async function getCoordinatesFromAddress(address) {
  const apiKey = process.env.GOOGLE_MAP_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.status === "OK" && response.data.results?.length > 0) {
    const location = response.data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }

  throw new Error("Unable to fetch coordinates: " + response.data.status);
}

// Get distance & time between origin and destination
async function getDistanceTime(origin, destination) {
  if (!origin || !destination)
    throw new Error("Origin and Destination required");

  const apiKey = process.env.GOOGLE_MAP_API;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.status === "OK") {
    const element = response.data.rows[0].elements[0];
    if (element.status === "ZERO_RESULTS") throw new Error("No routes found");
    return element; // { distance: {...}, duration: {...} }
  }

  throw new Error("Unable to fetch distance/time: " + response.data.status);
}

// Find captains within radius
async function getCaptainsInTheRadius(lat, lng, radius) {
  if (!lat || !lng || !radius) throw new Error("lat, lng and radius required");

  return await captianModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius / 6371],
      },
    },
  });
}

module.exports = {
  getCoordinatesFromAddress,
  getDistanceTime, // ✅ export it
  getCaptainsInTheRadius,
};
