import express from "express";
import passport from "passport";
import { generateToken } from "../utils/index.js";

const router = express.Router();

router.post(
  "/register",
  passport.authenticate("register", { failureMessage: true }),
  (req, res) => res.status(201).send({ status: "success", message: "User registered successfully" })
);

router.post(
  "/login",
  passport.authenticate("login", { failureMessage: true }),
  (req, res) => {
    const token = generateToken(req.user);
    res.cookie("tokenCookie", token, { httpOnly: true, maxAge: 3600000 });
    res.send({ status: "success", token });
  }
);

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send({ status: "success", user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("tokenCookie");
  res.send({ status: "success", message: "Logged out" });
});

export default router;
