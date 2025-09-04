const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const Captain = require("./models/captian.model"); // renamed for clarity

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
    console.log("🔌 Socket connected:", socket.id);

    // Handle join event
    socket.on("join", async ({ userId, userType }) => {
      console.log(
        `User ${userId} (${userType}) joined with socket ${socket.id}`
      );

      try {
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (err) {
        console.error("Error saving socketId:", err);
      }
    });

    // Handle captain location update
    socket.on("update-location-captain", async ({ userId, location }) => {
      try {
        const { lat, lng } = location;
        if (lat == null || lng == null) {
          console.warn(" Invalid location received:", location);
          return;
        }

        const result = await Captain.findByIdAndUpdate(
          userId,
          {
            $set: { location: { type: "Point", coordinates: [lng, lat] } },
          },
          { new: true }
        );
        console.log(result);

        console.log(" Captain location updated:", { userId, lat, lng });
      } catch (err) {
        console.error("Error updating captain location:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });
}

/**
 * Send a message to a specific socket ID
 * @param {string} socketId
 * @param {string} event
 * @param {any} message
 */
function sendMessageToSocket(socketId, event, message) {
  if (!io) return console.error("Socket.io not initialized");

  const target = io.sockets.sockets.get(socketId);
  if (target) {
    console.log(`📨 Sending message to ${socketId}:`, message);
    target.emit(event, message);
  } else {
    console.warn("Socket not found:", socketId);
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocket,
};
