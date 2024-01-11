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
router.route('/app/createApp').post(createApp);
router.route('/app/showAllApps').get(getAllApp);
router.route('/app/showApp').get(getApp);
router.route('/app/editApp').post(editApp);

//routes relating to plan
router.route('/app/plan/createPlan').post(createPlan);
router.route('/app/plan/getAllPlans').get(getAllPlans);
router.route('/app/plan/getPlan').get(getPlan);


module.exports = router;