const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));

const server = app.listen(port, () => {
   console.log(`Lestening port on ${port}`);
});

let io = require("socket.io")(server);
io.on("connection", (socket) => {
   console.log(`New Connection ${socket.io}`);
   socket.on("comment", (data) => {
      data.time = Date();
      socket.broadcast.emit("comment", data);
   });
   socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data);
   });
});
