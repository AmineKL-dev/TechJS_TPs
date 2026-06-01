// src/server.ts

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import booksRouter from "./routes/books";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/booktracker";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api/books", booksRouter);

// Serve frontend for all other routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Connect to MongoDB then start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("  Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("  MongoDB connection error:", err);
    process.exit(1);
  });

export default app;
