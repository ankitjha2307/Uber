const axios = require("axios");
const captianModel = require("../models/captian.model");

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

    return element;
  } else {
    throw new Error("Unable to fetch the distance: " + response.data.status);
  }
}

// Autocomplete suggestions
async function getAutoCompleteSuggestions(input) {
  if (!input) {
    throw new Error("query is Required");
  }

  const apiKey = process.env.GOOGLE_MAP_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.status === "OK") {
    return response.data.predictions;
  } else {
    throw new Error("Unable to fetch data: " + response.data.status);
  }
}

// Find captains near a location
async function getCaptainsInTheRadius(ltd, lng, radius) {
  if (!ltd || !lng || !radius) {
    throw new Error("lat, lng and radius are required");
  }

  return await captianModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, ltd], radius / 6371], // Note: [lng, lat] order for MongoDB
      },
    },
  });
}

module.exports = {
  getCoordinatesFromAddress,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getCaptainsInTheRadius,
};
