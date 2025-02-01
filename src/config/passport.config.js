import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) return done(null, false, { message: "Email already in use" });

          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await UserModel.create({ ...req.body, email, password: hashedPassword });

          return done(null, newUser);
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
          const user = await UserModel.findOne({ email });
          if (!user || !(await bcrypt.compare(password, user.password))) {
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
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => (req.cookies ? req.cookies.tokenCookie : null),
        ]),
        secretOrKey: process.env.JWT_PRIVATE_KEY || "defaultPrivateKey",
      },
      async (payload, done) => {
        try {
          const user = await UserModel.findById(payload.id);
          return done(null, user || false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
