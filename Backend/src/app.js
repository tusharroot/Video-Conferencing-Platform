import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";
import { connectToScoket } from "./controllers/socketManager.js";
import mongoose from "mongoose";

import cors from "cors";
import userRoutes from "./routes/users.route.js";
const app = express();
const server = createServer(app);
const io = connectToScoket(server);

app.set("port", process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/hello", (req, res) => {
  res.json({ done: "Done done" });
});

const start = async () => {
  const connectionDb = await mongoose.connect(
    "mongodb+srv://tusharpatel3217:j_Wh8ciyndATHTV@zoomclone.hjahisi.mongodb.net/?retryWrites=true&w=majority&appName=ZoomClone"
  );

  console.log(`MongoDb Connected Db Host: ${connectionDb.connection.host}`);

  server.listen(app.get("port"), () => {
    console.log("LISTENIN ON PORT ", app.get("port"));
  });
};

start();
