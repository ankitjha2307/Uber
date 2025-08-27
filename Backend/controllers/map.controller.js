const mapsservice = require("../service/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    // ✅ now this matches exactly with the export
    const coordinates = await mapsservice.getCoordinatesFromAddress(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};
