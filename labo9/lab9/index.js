const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 8080;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (payload) => {
    io.emit("chat message", payload);
  });
});

server.listen(PORT, (e) => {
  if (e) {
    console.log("Error while attempting to start server: ", e);
  } else {
    console.log(`Server is listening at http://localhost:${PORT}/`);
  }
});
