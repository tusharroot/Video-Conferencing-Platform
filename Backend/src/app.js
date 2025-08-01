import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv"
import { Server } from "socket.io";
import { connectToScoket } from "./controllers/socketManager.js";
import mongoose from "mongoose";

import cors from "cors";
import userRoutes from "./routes/users.route.js";
const app = express();
const server = createServer(app);
const io = connectToScoket(server);

dotenv.config();

app.set("port", process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/hello", (req, res) => {
  res.json({ done: "Done done" });
});

const start = async () => {
  const connectionDb = await mongoose.connect(process.env.MONGODB_URI);

  console.log(`MongoDb Connected Db Host: ${connectionDb.connection.host}`);

  server.listen(app.get("port"), () => {
    console.log("LISTENIN ON PORT ", app.get("port"));
  });
};

start();
