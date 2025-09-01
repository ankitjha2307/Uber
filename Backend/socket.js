const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const captianModel = require("./models/captian.model");
const Captain = require("./models/captian.model");

let io = null;

/**
 * Initializes Socket.IO with the provided HTTP server.
 * @param {http.Server} server
 */
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      console.log(
        `User ${userId} (${userType}) joined with socket ${socket.id}`
      );

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captianModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("update-location-captain", async (data) => {
      console.log("Received location:", data);

      const { userId, location } = data;

      if (!location || isNaN(location.ltd) || isNaN(location.lng)) {
        console.error("Invalid location received:", location);
        return;
      }

      // Update DB and fetch captain
      const captain = await Captain.findByIdAndUpdate(
        userId,
        { $set: { location } },
        { new: true }
      );

      console.log("Updated Captain:", captain); // 👈 Captain with updated location
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

/**
 * Sends a message to a specific socket by ID.
 * @param {string} socketId
 * @param {string} event
 * @param {any} message
 */
function sendMessageToSocket(socketId, event, message) {
  console.log(`Sending Messeage to ${socketId}`, message);

  if (io) {
    io.to(socketId).emit(event, message);
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocket,
};
