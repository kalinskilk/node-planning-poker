import { Socket } from "socket.io";
import { IDataRoom, IPlayer, IVotesRoom } from "./interfaces";
import { Rooms } from "./room";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";

const app = express();

require("dotenv").config();

app.use(function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  app.use(cors());
  next();
});

app.use(bodyParser.json());

const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: process.env.URL_ACCEPT_CORS,
    methods: ["GET", "POST"],
  },
});

const Room = new Rooms();

io.on("connection", (socket: Socket) => {
  console.log("CONNECTING");

  socket.on("vote", (obj: { votesRoom: IVotesRoom; roomId: string }) => {
    const hasVoted = Room.vote(obj.votesRoom, obj.roomId);
    if (!hasVoted) {
      return;
    }
    const dataRoom: IDataRoom = {
      roomId: obj.roomId,
      action: "VOTE",
      data: obj.votesRoom,
    };
    io.emit(obj.roomId, dataRoom);
  });

  socket.on("flip-cards", (obj: { roomId: string }) => {
    Room.flipCards(obj.roomId);
    const dataRoom: IDataRoom = {
      roomId: obj.roomId,
      action: "FLIP_CARDS",
      data: null,
    };
    io.emit(obj.roomId, dataRoom);
  });

  socket.on("restart-votation", (obj: { roomId: string }) => {
    Room.clearVotes(obj.roomId);
    const dataRoom: IDataRoom = {
      roomId: obj.roomId,
      action: "RESTART_VOTATION",
      data: null,
    };
    io.emit(obj.roomId, dataRoom);
  });

  socket.on("leave-room", (obj: { roomId: string; userName: string }) => {
    const leaved = Room.leaveRoom(obj);
    if (!leaved) {
      return;
    }
    const dataRoom: IDataRoom = {
      roomId: obj.roomId,
      action: "USER_LEAVED",
      data: { userName: obj.userName },
    };
    io.emit(obj.roomId, dataRoom);
  });
});

http.listen(process?.env?.PORT || 3000, () => {
  console.log(`Listening on port ${process?.env?.PORT || 3000}`);
});

app.post("/create-new-room", (req: any, res: any) => {
  // Your code here
  const player: IPlayer = req.body;
  const roomId = Room.newRoom(player);
  return res.send({ data: { roomId: roomId }, success: true });
});

app.post("/join-room", (req: any, res: any) => {
  const { player, roomId } = req.body as { player: IPlayer; roomId: string };
  const joined = Room.joinRoom(player, roomId);

  if (!joined.success) {
    return res
      .status(400)
      .send({ data: null, success: false, message: joined.message });
  }
  const dataRoom: IDataRoom = {
    roomId: roomId,
    action: "JOIN_ROOM",
    data: { player },
  };
  io.emit(roomId, dataRoom);
  return res.send({
    data: { roomId: roomId, player },
    success: true,
    message: joined.message,
  });
});

app.get("/get-votes", (req: any, res: any) => {
  // Your code here
  const params = req.query as { roomId: string };
  const data = Room.getRoom(params.roomId);
  return res.send(data);
});
