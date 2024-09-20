const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username });
        user.password = await user.encryptPassword(password);
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.send('Error registering user');
    }
});

// Login User
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

// Logout User
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

module.exports = router;
