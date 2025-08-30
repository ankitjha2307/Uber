const mapsservice = require("../service/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    const coordinates = await mapsservice.getCoordinatesFromAddress(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;
    const distanceTime = await mapsservice.getDistanceTime(origin, destination);

    res.status(200).json(distanceTime);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;
    const predictions = await mapsservice.getAutoCompleteSuggestions(input);

    // ✅ wrap inside { predictions } so frontend can always use res.data.predictions
    res.status(200).json({ predictions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
