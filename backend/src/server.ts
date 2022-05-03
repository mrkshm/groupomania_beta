import "reflect-metadata";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { createConnection } from "typeorm";
import express, { Request, Response } from "express";
import morgan from "morgan";

import trim from "./middleware/trim";

import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import tagRoutes from "./routes/tags";
import miscRoutes from "./routes/misc";

dotenv.config();

const app = express();

app.use(express.json());

app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.use((_: Request, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
  })
);
app.use(express.static("public"));
app.get("/", (_: Request, res: Response) => res.send("hello world"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/misc", miscRoutes);

app.listen(process.env.PORT, async () => {
  console.log("server running at localhost:" + process.env.PORT);
  try {
    await createConnection();
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
});
