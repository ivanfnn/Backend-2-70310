import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import mongoose from "mongoose";

import initializePassport from "./config/passport.config.js";
import sessionRouter from "./routes/session.router.js";
import cartRouter from "./routes/cart.router.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use("/session", sessionRouter);
app.use("/cart", cartRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(console.error);
