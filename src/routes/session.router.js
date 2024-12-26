import express from 'express';
import User from '../models/user.models.js';
import { createHash , isValidPassword } from '../utils.js'

import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils.js';

const router = express.Router();


router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), (req, res) => {
    res.redirect('/login');
});


router.get('/failregister', (req, res) => {
    res.send({ error: 'Failed' });
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), (req, res) => {
    const token = generateToken(req.user);
    res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect('/perfil');
});


router.get('/faillogin', (req, res) => {
    res.send({ error: 'Failed Login' });
});


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({ status: 'success', payload: req.user });
});


router.post('/logout', (req, res) => {
    res.clearCookie('tokenCookie');
    res.redirect('/login');
});

export default router;
