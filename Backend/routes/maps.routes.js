const express = require("express");
const router = express.Router();
const mapcontroller = require("../controllers/map.controller");
const { query } = require("express-validator");

router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  mapcontroller.getCoordinate
);

router.get(
  "/get-ditance-time",
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
  mapcontroller.getDistanceTime
);

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 3 }),
  mapcontroller.getAutoCompleteSuggestions
);

module.exports = router;
