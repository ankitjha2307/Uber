const captianModel = require("../models/captian.model");

module.exports.createCaptian = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  vehicleType,
  capacity,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !vehicleType ||
    !capacity
  ) {
    throw new Error("All fields are required");
  }

  const captain = captianModel({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      plate,
      vehicleType,
      capacity,
    },
  });

  return captain;
};
