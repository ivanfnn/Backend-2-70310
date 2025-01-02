import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import bcrypt from "bcrypt";
import userService from "../models/User.js";

const LocalStrategy = local.Strategy;

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { first_name, last_name, age } = req.body;
      try {
        const user = await userService.findOne({ email });
        if (user) {
          return done(null, false, { message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: hashedPassword
        };

        const userCreated = await userService.create(newUser);
        return done(null, userCreated);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await userService.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new jwt.Strategy(
    {
      jwtFromRequest: (req) => req.cookies?.tokenCookie || null,
      secretOrKey: process.env.JWT_PRIVATE_KEY || "defaultPrivateKey"
    },
    async (payload, done) => {
      try {
        const user = await userService.findById(payload.id);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
