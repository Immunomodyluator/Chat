import express from "express";
import http from "http";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./router/authRouter.js";

const app = express();
const server = http.createServer(app);
const PORT = 80;

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors());
app.use(router);

const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on("connection", function connections(ws) {
  const connectionId = randomUUID();

  clients.add(connectionId);

  ws.on("message", function (message) {
    message = JSON.parse(message);
    console.log(clients);
    message.uuid = JSON.stringify([...clients]);
    broadcastMessage(message);
  });

  ws.on("close", function () {
    clients.delete(connectionId);
    console.log(clients);
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

mongooseConnect().then(() => {
  console.log("База данных подключена");
});

async function mongooseConnect(uri, callback) {
  await mongoose.connect(
    "mongodb://localhost:27017/server?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    () => {}
  );
}

server.listen(PORT, () => {
  console.log(`listening on: ${PORT}`);
});
