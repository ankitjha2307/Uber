const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captian.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Vehicle color is required"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Vehicle plate is required"),
    body("vehicle.capacity")
      .isNumeric()
      .withMessage("Vehicle capacity must be a number"),
  ],
  captainController.registerCaptain // ✅ pass the function reference
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.loginCaptain // ✅ pass the function reference
);

router.get(
  "/profile",
  authMiddleware.authCaptain, // ✅ middleware
  captainController.getCaptainProfile // ✅ controller
);

router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

module.exports = router;
