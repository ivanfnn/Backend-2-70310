import express from "express";
import path from "path";
import { __dirname } from "../utils.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "vista_login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "vista_registro.html"));
});

router.get("/perfil", (req, res) => {
  if (req.user) {
    res.render("perfil", {
      user: {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
      }
    });
  } else {
    res.redirect("/login");
  }
});

export default router;
