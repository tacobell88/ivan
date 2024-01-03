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

// routes relating to admin user
//router.route('/users/getUsers').get(isAuthenticated, isAuthRole("admin"),showAllUser);
router.route('/users/getUsers').get(showAllUser);
router.route('/users/createUser').post(isAuthenticated, isAuthRole("admin"), createUser);
router.route('/users/editUser').post(adminEditUser);
//isAuthenticated, isAuthRole("admin"),
// routes relating to admin & normal user
router.route('/users/updateUser').post(isAuthenticated, editUserProfile);

// routes relating to user groups (roles) for admin
router.route('/users/createRole').post(createGroup);
router.route('/users/getAllRoles').get(getAllUserGroup)

module.exports = router;