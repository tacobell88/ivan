const express = require('express');
const router = express.Router();

const { 
    createGroup,
    getAllUserGroup,
    CheckingGroup
} = require('../controllers/groupController');

const { 
    showAllUser,
    createUser,
    adminEditUser,
    editUserProfile,
    getUser
} = require('../controllers/userController');

const { isAuthenticated,
        isAuthRole } = require('../middlewares/authMidware');

// routes relating to admin user
router.route('/users/getUsers').get(isAuthenticated, showAllUser);
router.route('/users/createUser').post(isAuthenticated, isAuthRole("admin"), createUser);
router.route('/users/editUser').post(isAuthenticated, isAuthRole("admin"), adminEditUser);

// router.route('/users/getUsers').get(showAllUser);
// router.route('/users/createUser').post(createUser);
// router.route('/users/editUser').post(adminEditUser);

// implement /users/getProfile
router.route('/users/userProfile').get(isAuthenticated, getUser);

//isAuthenticated, isAuthRole("admin"),
// routes relating to admin & normal user
// tested to be working
router.route('/users/updateUser').post(isAuthenticated, editUserProfile);

// routes relating to user groups (roles) for admin
router.route('/users/createRole').post(isAuthenticated, isAuthRole("admin"), createGroup);
router.route('/users/getAllRoles').get(isAuthenticated, isAuthRole("admin"), getAllUserGroup);
router.route('/checkGroup').post(isAuthenticated, CheckingGroup);

module.exports = router;