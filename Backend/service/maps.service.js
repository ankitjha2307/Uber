const axios = require("axios");

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

// ✅ export as an object with the same function name
module.exports = { getCoordinatesFromAddress };
