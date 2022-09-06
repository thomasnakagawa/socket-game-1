import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import { GenerateGameID } from "./src/gameid";

const app = express();
const port = process.env.PORT || 3000
app.set("port", port);

const http = require("http").Server(app);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});

const roomName = 'default-room';

const io: socketio.Socket = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO3: true
});

io.on("connection", (socket) => {
  console.log("user connected");
  let currentGame;

  function joinGame(gameId: string) {
    socket.leaveAll();
    socket.join(gameId);
    currentGame = gameId;
  }

  socket.on("message", (message) => {
    console.log(`message ${message}`);
    socket.to(currentGame).emit("message", { username: socket.username, message });
  });

  socket.on("new-game", (data, ack) => {
    const { username } = data;
    socket.username = username;

    const newGameId = GenerateGameID();
    joinGame(newGameId);
    ack({ gameId: newGameId });
  });

  socket.on("join-game", (data, ack) => {
    const { gameId, username } = data;

    socket.username = username;
    joinGame(gameId);

    ack({ gameId });
  });
});

const server = http.listen(port, function() {
  console.log(`listening on port ${port}`);
});
