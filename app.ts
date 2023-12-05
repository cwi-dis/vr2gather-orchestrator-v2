import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";

dotenv.config();

import { getFromEnvironment } from "./util";
import Orchestrator from "./app/orchestrator";

import installConnectionHandlers, { installLoginHandler } from "./endpoints/connection_management";
import installSessionHandlers from "./endpoints/session_management";
import installUtilHandlers from "./endpoints/util";
import installUserDataHandlers from "./endpoints/user_data";
import installSceneEventHandlers from "./endpoints/scene_events";
import installStreamHandlers from "./endpoints/data_streams";

const [ LOG_FOLDER, LOG_SERVER_PORT, PORT ] = getFromEnvironment(
  "LOG_FOLDER", "LOG_SERVER_PORT", "PORT"
);

const io = new Server();
io.listen(parseInt(PORT));
console.log("Socket.io server listening on port", PORT);

const orchestrator = new Orchestrator();

io.on("connection", async (socket) => {
  const user = await installLoginHandler(orchestrator, socket);

  installConnectionHandlers(orchestrator, user);
  installSessionHandlers(orchestrator, user);
  installUserDataHandlers(orchestrator, user);
  installSceneEventHandlers(user);
  installStreamHandlers(user);
  installUtilHandlers(user);
});

const staticHttpServer = express();

staticHttpServer.get("/", (req, res) => {
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify({}));
});

staticHttpServer.use("/log", express.static(LOG_FOLDER));

staticHttpServer.listen(LOG_SERVER_PORT, () => {
  console.log("Log server listening on port", LOG_SERVER_PORT);
});
