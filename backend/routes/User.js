const express = require('express');
const router = express.Router();

const { 
    createGroup,
    getAllUserGroup 
} = require('../controllers/groupController');

const { 
    showAllUser,
    createUser,
    adminEditUser,
    editUserProfile
} = require('../controllers/userController');

const { isAuthenticated,
        isAuthRole } = require('../middlewares/authMidware');

// routes relating to users
router.route('/users/getUsers').get(showAllUser);
router.route('/users/createUser').post(createUser);
router.route('')

// routes relating to user groups (roles)
router.route('/users/createRole').post(createGroup);
router.route('/users/getAllRoles').get(getAllUserGroup)

module.exports = router;