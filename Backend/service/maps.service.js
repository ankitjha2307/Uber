const axios = require("axios");

// Get coordinates from an address
async function getCoordinatesFromAddress(address) {
  const apiKey = process.env.GOOGLE_MAP_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  const response = await axios.get(url);

  if (
    response.data.status === "OK" &&
    response.data.results &&
    response.data.results.length > 0
  ) {
    const location = response.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  } else {
    throw new Error("Unable to fetch coordinates: " + response.data.status);
  }
}

// Get distance & time between two points
async function getDistanceTime(origin, destination) {
  if (!origin || !destination) {
    throw new Error("Origin and Destination are required");
  }

  const apiKey = process.env.GOOGLE_MAP_API;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.status === "OK") {
    const element = response.data.rows[0].elements[0];
    if (element.status === "ZERO_RESULTS") {
      throw new Error("No routes found");
    }

    return response.data.rows[0].elements[0];
  } else {
    throw new Error("Unable to fetch the distance: " + response.data.status);
  }
}

// ✅ Export both functions properly
module.exports = {
  getCoordinatesFromAddress,
  getDistanceTime,
};
