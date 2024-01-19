const express = require("express");
const router = express.Router();

const { isAuthenticated, isAuthRole } = require("../middlewares/authMidware");

const {
  createApp,
  getAllApp,
  getApp,
  editApp,
  createPlan,
  getAllPlans,
  getPlan,
  editPlan,
  checkPermissions,
  getPlanNames,
  testAuditTrail,
  createTask,
} = require("../controllers/appController");

// const {} = require('../controllers/planController');

// const {} = require('../controllers/taskController');

// routes relating to app
router
  .route("/app/createApp")
  .post(isAuthenticated, isAuthRole("pl"), createApp);
router.route("/app/showAllApps").get(isAuthenticated, getAllApp);
router.route("/app/showApp").get(isAuthenticated, getApp);
router.route("/app/editApp").post(isAuthenticated, editApp);

//routes relating to plan
router.route("/app/plan/createPlan").post(isAuthenticated, createPlan);
router.route("/app/plan/getAllPlans").get(isAuthenticated, getAllPlans);
router.route("/app/plan/getPlan").get(isAuthenticated, getPlan);
router.route("/app/plan/getPlanNames").get(isAuthenticated, getPlanNames);
router.route("/app/plan/editPlan").post(isAuthenticated, editPlan);

router.route("/checkPerms").post(isAuthenticated, checkPermissions);
router.route("/auditTrail").get(testAuditTrail);
router.route("/app/task/create").post(isAuthenticated, createTask);

module.exports = router;
