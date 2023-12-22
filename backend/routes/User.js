const express = require('express');
const router = express.Router();

const { 
    showAllUser,
    createUser
} = require('../controllers/UserController');

const { 
    createRole,
    getAllUserGroup 
} = require('../controllers/GroupController');



router.route('/users/getUsers').get(showAllUser);
router.route('/users/createUser').post(createUser);

// routes relating to user groups (roles)
router.route('/users/createRole').post(createRole);
router.route('/users/getAllRoles').get(getAllUserGroup)

module.exports = router;