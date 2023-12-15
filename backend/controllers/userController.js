const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new account
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);

        await user.createUser(username, hashedPass, email);
        res.status(200).send('User is created sucessfully');
    } catch (error) {
        res.status(500).send('Error creating new user');
    }
}

