const express = require('express');
const router = express.Router();

const { userLogin } = require('../controllers/AuthController');

router.route('/login').post(userLogin);

module.exports = router;