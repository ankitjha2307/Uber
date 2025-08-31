const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const captianModel = require("./models/captian.model");

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

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captianModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
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
  if (io) {
    io.to(socketId).emit(event, message);
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocket,
};
