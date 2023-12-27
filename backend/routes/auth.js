const express = require('express');
const router = express.Router();

const { 
    userLogin,
    userLogout 
} = require('../controllers/authController');

const { isAuthenticated,
        isAuthRole } = require('../middlewares/authMidware');

router.route('/login').post(userLogin);
router.route('/logout').get(isAuthenticated, userLogout);

module.exports = router;