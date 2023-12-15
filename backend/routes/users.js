const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../controllers/userController');

//register new user route
router.post('/register', user.register);

//user login route
//router.post('/login', user.login);


module.exports = router;