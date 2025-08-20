const userModel = require("../models/user.model");
const bctypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
const captianModel = require("../models/captian.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  //   const isBlacklisted = await userModel.findOne({ token: token });

  //   if (!isBlacklisted) {
  //     return res.status(401).json({ message: "UnAutohorize" });
  //   }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).lean();
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captianModel.findById(decoded._id).lean();
    if (!captain) {
      return res.status(401).json({ message: "Captain not found" });
    }
    req.captain = captain;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};
