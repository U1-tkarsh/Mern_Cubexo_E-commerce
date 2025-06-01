const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            userRole: user.userRole
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    );
};

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, password });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            userRole: user.userRole,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            error: "Fields must not be empty",
        });
    }

    try {

        const user = await User.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.status(200).json({
            token,
            userRole: user.userRole,
            name: user.username
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;