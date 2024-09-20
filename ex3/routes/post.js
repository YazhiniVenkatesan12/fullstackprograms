const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create a Post
router.post('/create', async (req, res) => {
    try {
        const post = new Post({
            content: req.body.content,
            user: req.user._id
        });
        await post.save();
        res.redirect('/dashboard');
    } catch (err) {
        res.send('Error creating post');
    }
});

// Like a Post
router.post('/like/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.likes.push(req.user._id);
        await post.save();
        res.redirect('/posts');
    } catch (err) {
        res.send('Error liking post');
    }
});

module.exports = router;
