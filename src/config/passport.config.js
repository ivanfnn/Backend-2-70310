import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import userService from '../models/User.js';
import { isValidPassword } from '../utils.js';


passport.use('register', new local.Strategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
            let user = await userService.findOne({ email: email });
            if (user) {
                return done(null, false, { message: 'User already exists' });
            }
            let newUser = {
                first_name, 
                last_name,
                email, 
                age,
                password: password 
            };
            const userCreated = await userService.create(newUser);
            return done(null, userCreated);
        } catch (error) {
            return done(error);
        }
    }
));


passport.use('login', new local.Strategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
        try {
            const user = await userService.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


passport.use(new jwt.Strategy({
    jwtFromRequest: (req) => req.cookies.tokenCookie,
    secretOrKey: process.env.JWT_PRIVATE_KEY || 'defaultPrivateKey'
}, async (payload, done) => {
    try {
        const user = await userService.findById(payload.id);
        if (!user) {
            return done(null, false, { message: 'No such user' });
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));
