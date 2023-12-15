const express = require('express');
const router = express.Router();
const authController = require('../middleware/authMidWare');

router.get('/validate', authController.validateToken);

module.exports = router;
