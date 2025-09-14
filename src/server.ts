import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import tweetRoutes from "./routes/tweet";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "";

mongoose.connect(MONGO)
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error("Mongo connection error:", err);
  });
