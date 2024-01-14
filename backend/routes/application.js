const express = require('express');
const router = express.Router();

const { isAuthenticated,
        isAuthRole } = require('../middlewares/authMidware');

const { createApp,
        getAllApp,
        getApp,
        editApp, 
        createPlan,
        getAllPlans,
        getPlan} = require('../controllers/appController');

// const {} = require('../controllers/planController');

// const {} = require('../controllers/taskController');


// routes relating to app
router.route('/app/createApp').post(isAuthenticated, isAuthRole("pl"), createApp);
router.route('/app/showAllApps').get(isAuthenticated, getAllApp);
router.route('/app/showApp').get(isAuthenticated, getApp);
router.route('/app/editApp').post(isAuthenticated, editApp);

//routes relating to plan
router.route('/app/plan/createPlan').post(isAuthenticated, createPlan);
router.route('/app/plan/getAllPlans').get(isAuthenticated, getAllPlans);
router.route('/app/plan/getPlan').get(isAuthenticated, getPlan);


module.exports = router;