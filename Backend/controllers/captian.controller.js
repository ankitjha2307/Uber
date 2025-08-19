const captianModel = require("../models/captian.model");

const captianService = require("../service/captian.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  const existingCaptain = await captianModel.findOne({ email });
  if (existingCaptain) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const hashPassword = await captianModel.hashPassword(password);

  const captain = await captianService.createCaptian({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    vehicleType: vehicle.vehicleType,
    capacity: vehicle.capacity,
  });

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};
