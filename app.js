import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
app.use(express.static("public"));

const PORT = 80;

let users = [];

app.get("/hello", function (req, res) {
  res.send("hello world");
});

io.on("connection", (socket) => {
  let ID = socket.id.toString().slice(1, 6);
  let IP = socket.handshake.address;
  console.log(`${ID} connected`);
  users.push({ id: ID, ip: IP });
  console.log(users);

  socket.on("chat message", (msg) => {
    io.emit("chat message", `${ID}: ${msg}`);
    console.log("message: " + `${ID}: ${msg}`);
  });

  socket.on("disconnecting", () => {
    let obIndex = users.findIndex((item) => item.id === ID);
    users.splice(obIndex, 1);
    onlineUser();
    console.log(`${ID} disconnected`);
  });

  function onlineUser() {
    let usersHTML = "";
    for (let key in users) {
      usersHTML = usersHTML + `<div>id ${users[key].id}</div>`;
    }
    io.emit("usersHTML", usersHTML);
  }
});

httpServer.listen(PORT, () => {
  console.log(`listening on: ${PORT}`);
});
