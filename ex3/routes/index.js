const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Home Page
router.get('/', (req, res) => {
    res.render('index');
});

// Dashboard Page
router.get('/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const users = await User.find({ _id: { $ne: req.user._id } });
    res.render('dashboard', { user: req.user, users });
});

// Follow a User
router.post('/follow/:id', async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        req.user.following.push(userToFollow._id);
        await req.user.save();
        res.redirect('/dashboard');
    } catch (err) {
        res.send('Error following user');
    }
});

// View Posts
router.get('/posts', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const posts = await Post.find({ user: { $in: req.user.following } }).populate('user');
    res.render('posts', { posts });
});

module.exports = router;
