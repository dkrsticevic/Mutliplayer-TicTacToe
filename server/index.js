const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
var crypto = require("crypto");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on("join_room", (Code) => {
        let rooms = io.sockets.adapter.rooms;
        let room = rooms.get(Code);

        if (room == undefined) {
          socket.join(Code);
          socket.emit("waiting", true);
          console.log(`user ${socket.id} created the room ${Code}`);
        } else if (room.size == 1) {
          console.log(`user ${socket.id} joined the room ${Code}`);
          socket.join(Code);
          socket.emit("waiting", false);
          socket.broadcast.to(Code).emit("waiting", false);
        } else {
          console.log(`room ${Code} is full`);
          socket.emit("full");
        }
      });
    
      socket.on("play", ({ id, roomCode }) => {
        console.log(`play at ${id} to ${roomCode}`);
        socket.broadcast.to(roomCode).emit("updateGame", id);
      });

      socket.on("restart", ({ roomCode }) => {
        console.log(`Restart lobby: ${roomCode}`);
        socket.broadcast.to(roomCode).emit("restart");
      });
    
      socket.on("disconnect", () => {
        console.log(`User ${socket.id} Disconnected`);
      });

      socket.on("leave", (code) =>{
        console.log(`User ${socket.id} left lobby ${code}`);
        socket.leave(code);
      })
    
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});