const captianModel = require("../models/captian.model");

const captianService = require("../service/captian.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

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

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  console.log("Incoming email:", email);

  const captain = await captianModel.findOne({ email }).select("+password");

  console.log("Captain found:", captain);

  if (!captain) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json(req.captain);
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  await blacklistTokenModel.create({ token });

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
