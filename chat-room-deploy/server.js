const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Default route → serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Store users
let activeUsers = new Set();

// Socket.IO connection
io.on("connection", (socket) => {
  // When a user joins
  socket.on("new-user", (username) => {
    socket.username = username;
    activeUsers.add(username);
    io.emit("update-users", Array.from(activeUsers));
  });

  // When a user sends a message
  socket.on("chat-message", (message) => {
    io.emit("chat-message", {
      username: socket.username,
      text: message,
      timestamp: new Date().toISOString()
    });
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    if (socket.username) {
      activeUsers.delete(socket.username);
      io.emit("update-users", Array.from(activeUsers));
    }
  });
});

// Use Render’s provided PORT (important!)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
