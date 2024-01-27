const db = require("../config/database");
const catchASyncError = require("../middlewares/catchASyncError");
const ErrorHandler = require("../utils/errorHandler");
const { Checkgroup } = require("../controllers/GroupController");

exports.CreateTask = catchASyncError(async (req, res, next) => {
  const {
    username,
    password,
    task_name,
    app_acronym,
    task_description,
    task_notes,
    task_plan,
  } = req.body;

  let task_status = "open";

  const createTaskSQL = `INSERT INTO tasks `;
});

exports.GetTaskByState = catchASyncError(async (req, res, next) => {
  const { app_acronym, task_status } = req.body;

  const taskStateSQL = `SELECT task_id from tasks where task_status =? AND task_app_acronym =?`;
  const [taskStateRows, taskStateFields] = await db.execute(taskStateSQL, [
    task_status,
    app_acronym,
  ]);
  if (taskStateRows.length === 0) {
    res.status(400).json({
      code: "SB001",
      message: "Application does not exist",
    });
  }

  const taskIds = taskStateRows.map((row) => row.task_id);

  return res.status(200).json({
    code: "TXN001",
    task_id: taskStateRows,
  });
});

exports.PromoteTask2Done = catchASyncError(async (req, res, next) => {
  const { username, password, task_id, task_notes } = req.body;
});
