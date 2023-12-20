const user = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('');

class UserController {
    static async login (req,res) {
        try {
            const { username, password } = req.body;
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(400).json({message: 'Invalid credentails'});
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({message: 'Invalid credentails'});
            }

            const tkn = jwt.sign({username: user.username, userGroup: user.user_group}, 'your_jwt_secret');
            res.json({tkn});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
};

module.exports = UserController;