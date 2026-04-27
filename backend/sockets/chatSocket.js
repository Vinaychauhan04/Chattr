const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

// userId -> socketId map for presence tracking
const onlineUsers = new Map();

const initSocket = (io) => {
  // Authenticate socket connection via JWT
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Token invalid"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);

    // Mark user online in DB
    await User.findByIdAndUpdate(userId, { status: "online" });

    // Broadcast updated online list to everyone
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    // ── Send Message ──────────────────────────────────────────────
    socket.on("sendMessage", async ({ receiverId, message }) => {
      if (!receiverId || !message?.trim()) return;

      try {
        const newMsg = await Message.create({
          senderId: userId,
          receiverId,
          message: message.trim(),
        });

        const payload = {
          _id: newMsg._id,
          senderId: userId,
          receiverId,
          message: newMsg.message,
          read: false,
          createdAt: newMsg.createdAt,
        };

        // Deliver to receiver if online
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) io.to(receiverSocket).emit("receiveMessage", payload);

        // Confirm back to sender
        socket.emit("messageSent", payload);
      } catch (err) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ── Typing Indicator ──────────────────────────────────────────
    socket.on("typing", ({ receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) io.to(receiverSocket).emit("userTyping", { senderId: userId });
    });

    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) io.to(receiverSocket).emit("userStopTyping", { senderId: userId });
    });

    // ── Disconnect ────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { status: "offline" });
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = initSocket;
