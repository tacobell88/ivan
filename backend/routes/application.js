const express = require('express');
const router = express.Router();

const { isAuthenticated,
        isAuthRole } = require('../middlewares/authMidware');

const { createApp } = require('../controllers/appController');

router.route('/app/createApp').post(createApp)