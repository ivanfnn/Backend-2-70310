import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";

import initializePassport from "./config/passport.config.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRouter);
app.use("/session", sessionRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
