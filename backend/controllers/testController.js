const db = require("../utils/database");
const catchASyncError = require("../middlewares/catchASyncError");
const ErrorHandler = require("../utils/errorHandler");
const { Checkgroup } = require("./groupController");
const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const { mailTester } = require("../utils/nodemailer");
const Str = require("@supercharge/strings");

function validRnumber(str) {
  const validRegex = new RegExp(/^[0-9]\d*$/);
  return validRegex.test(str);
}

function validateInput(str) {
  // this regex is to check alpha / alpha numeric only (no special characters) and less than 45 characters
  const validRegex = new RegExp(/^[a-zA-Z][a-zA-Z0-9]{0,44}$/);
  return validRegex.test(str);
}

function validatePlanTask(str) {
  const validRegex = new RegExp(
    /^(?=.{1,45}$)[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*$/
  );
  return validRegex.test(str);
}

function validateWordCount(str) {
  const validRegex = new RegExp(/^.{0,255}$/);
  return validRegex.test(str);
}

function stringChecker(str) {
  return typeof str === "string";
}

exports.CreateTask = catchASyncError(async (req, res, next) => {
  var {
    username,
    password,
    task_name,
    task_app_acronym,
    task_description,
    task_notes,
    task_plan,
  } = req.body;

  // const {
  //   task_name,
  //   task_app_acronym,
  //   task_description,
  //   task_notes,
  //   task_plan,
  // } = req.body;

  const task_status = "open";

  if (
    !(
      typeof username === "string" &&
      typeof password === "string" &&
      typeof task_name === "string" &&
      typeof task_app_acronym === "string" &&
      typeof task_description === "string" &&
      typeof task_notes === "string" &&
      typeof task_plan === "string"
    )
  ) {
    return res.status(400).json({
      code: "V2",
    });
  }

  if (!username || !password) {
    res.status(400).json({
      code: "V2",
    });
  }

  // checking if there is  task_name input
  if (!task_name || task_name.trim() === "") {
    res.status(400).json({
      code: "V2",
    });
  }

  //checking if there is task_app_acronym input
  if (!task_app_acronym || task_app_acronym.trim() === "") {
    res.status(400).json({
      code: "V2",
    });
  }

  if (task_description === "") {
    task_description = null;
  }

  // checking for user login credentials
  const usernameSQL = `SELECT * FROM accounts where username=?`;
  const [usernameRows, usernameFields] = await db.execute(usernameSQL, [
    username,
  ]);

  // checking if username exist in database
  if (usernameRows.length === 0) {
    return res.status(400).json({
      code: "A1",
    });
  }

  const checkPassMatch = await bcrypt.compare(
    password,
    usernameRows[0].password
  );
  if (!checkPassMatch) {
    return res.status(400).json({
      code: "A1",
    });
  }

  if (usernameRows[0].isactive === "disabled") {
    return res.status(400).json({
      code: "A1",
    });
  }

  const checkAppExist = `SELECT * FROM applications where app_acronym =?`;
  const [checkAppRows, checkAppFields] = await db.execute(checkAppExist, [
    task_app_acronym,
  ]);

  if (checkAppRows.length === 0) {
    return res.status(400).json({
      code: "A2",
    });
  }

  const task_owner = username;
  const task_creator = username;

  // checking user permissions for access management
  const permSql = `SELECT app_permit_create, app_rnumber FROM applications where app_acronym =?`;
  const [permSqlRows, permSqlFields] = await db.execute(permSql, [
    task_app_acronym,
  ]);

  // could be an unneccessary check because app_permits cannot accept null values
  if (permSqlRows.length === 0) {
    return res.status(400).json({
      code: "A3",
    });
  }

  // logging the permission result
  console.log("This is query result of permsql: ", [
    permSqlRows[0].app_permit_create,
  ]);

  // checking if user that is trying to create the plan
  const checkPlanAuth = await Checkgroup(task_owner, [
    permSqlRows[0].app_permit_create,
  ]);
  if (!checkPlanAuth) {
    return res.status(400).json({
      code: "A3",
    });
  }

  // checking for E onward error codes

  // validating task notes and making it empty string if no notes typed
  if (!task_notes || task_notes === undefined || task_notes.trim() === "") {
    task_notes = "";
  }

  // checking if task_name conforms to constraints
  if (!validatePlanTask(task_name)) {
    return res.status(400).json({
      code: "E1",
    });
  }

  // checking if task_description is less than 255 characters
  if (!validateWordCount(task_description)) {
    return res.status(400).json({
      code: "E2",
    });
  }

  // const checkString = Str.isString(task_description);
  // if (checkString) {
  //   return res.status(400).json({
  //     code: "E3",
  //   });
  // }

  // checking if task_plan exists
  if (!(task_plan === "")) {
    const checkPlanExist = `SELECT * FROM plans WHERE plan_mvp_name =? AND plan_app_acronym=?`;
    const [checkPlanRows, checkPlansField] = await db.execute(checkPlanExist, [
      task_plan,
      task_app_acronym,
    ]);
    if (checkPlanRows.length === 0) {
      return res.status(400).json({
        code: "E4",
      });
    }
  }

  if (task_plan === "") {
    task_plan = null;
  }

  // create information for audit trail log
  const currentDate = dayjs();
  const formattedDate = currentDate.format("DD-MM-YYYY HH:mm:ss");
  const task_createdate = currentDate.format("DD-MM-YYYY");

  const notesDelimiter = " ====== ";
  //const auditTrailFormat = notesDelimiter + formattedDate + notesDelimiter;

  const auditTrailLog = `\n${notesDelimiter} Task created on: ${formattedDate} by user : ${task_owner} ${notesDelimiter}\n Task notes : \n ${task_notes} \n\n ===================================================================== \n`;

  const task_id = `${task_app_acronym}_${permSqlRows[0].app_rnumber + 1}`;
  const newRnum = permSqlRows[0].app_rnumber + 1;

  // after everything passes, create task can be executed
  const createTaskSQL = `INSERT INTO tasks VALUES(?,?,?,?,?,?,?,?,?,?)`;

  const [createTaskRows, crreateTaskFields] = await db.execute(createTaskSQL, [
    task_name,
    task_id,
    task_description,
    task_status,
    task_owner,
    task_creator,
    task_createdate,
    auditTrailLog,
    task_plan,
    task_app_acronym,
  ]);

  console.log(task_description);

  //update application app_rnumber
  const updateRnumSQL = `UPDATE applications SET app_rnumber=? WHERE app_acronym=?`;
  const [rnumRows, rnumFields] = await db.execute(updateRnumSQL, [
    newRnum,
    task_app_acronym,
  ]);

  // success code
  return res.status(200).json({
    code: "S1",
    data: task_id,
  });
});

exports.GetTaskByState = catchASyncError(async (req, res, next) => {
  var { username, password, task_app_acronym, task_status } = req.body;
  // const { app_acronym, task_status } = req.body;

  if (
    !(
      stringChecker(username) &&
      stringChecker(password) &&
      stringChecker(task_app_acronym) &&
      stringChecker(task_status)
    )
  ) {
    return res.status(400).json({
      code: "V2",
    });
  }

  if (!username || !password) {
    return res.status(400).json({
      code: "V2",
    });
  }

  if (!task_app_acronym || task_app_acronym.trim() === "") {
    return res.status(400).json({
      code: "V2",
    });
  }

  if (!task_status || task_status.trim() === "") {
    return res.status(400).json({
      code: "V2",
    });
  }

  const usernameSQL = `SELECT * FROM accounts where username=?`;
  const [usernameRows, usernameFields] = await db.execute(usernameSQL, [
    username,
  ]);

  // checking if username exist in database
  if (usernameRows.length === 0) {
    return res.status(400).json({
      code: "A1",
    });
  }

  const checkPassMatch = await bcrypt.compare(
    password,
    usernameRows[0].password
  );
  if (!checkPassMatch) {
    return res.status(400).json({
      code: "A1",
    });
  }

  if (usernameRows[0].isactive === "disabled") {
    return res.status(400).json({
      code: "A1",
    });
  }

  console.log(task_status);

  if (
    task_status !== "open" &&
    task_status !== "todo" &&
    task_status !== "doing" &&
    task_status !== "done" &&
    task_status !== "closed"
  ) {
    return res.status(400).json({
      code: "E1",
    });
  }

  const checkAppExistSQL = `SELECT * FROM applications WHERE app_acronym =?`;
  const [checkAppExistRows, checkAppExistFields] = await db.execute(
    checkAppExistSQL,
    [task_app_acronym]
  );

  if (checkAppExistRows.length === 0) {
    return res.status(400).json({
      code: "E2",
    });
  }

  const taskStateSQL = `SELECT * from tasks where task_status =? AND task_app_acronym =?`;
  const [taskStateRows, taskStateFields] = await db.execute(taskStateSQL, [
    task_status,
    task_app_acronym,
  ]);

  if (taskStateRows.length === 0) {
    return res.status(400).json({
      code: "E3",
    });
  }

  // const taskIds = taskStateRows.map((row) => row.task_id);

  return res.status(200).json({
    code: "S1",
    results: taskStateRows,
  });
});

exports.PromoteTask2Done = catchASyncError(async (req, res, next) => {
  const { username, password, task_id, task_notes } = req.body;

  if (
    !(
      stringChecker(username) &&
      stringChecker(password) &&
      stringChecker(task_id) &&
      stringChecker(task_notes)
    )
  ) {
    return res.status(400).json({
      code: "V2",
    });
  }

  const splitTask = task_id.split("_");
  let task_app_acronym = splitTask[0];

  if (!username || !password) {
    return res.status(400).json({
      code: "V2",
    });
  }

  if (!task_id || task_id.trim() === "") {
    return res.status(400).json({
      code: "V2",
    });
  }

  const usernameSQL = `SELECT * FROM accounts where username=?`;
  const [usernameRows, usernameFields] = await db.execute(usernameSQL, [
    username,
  ]);

  // checking if username exist in database
  if (usernameRows.length === 0) {
    return res.status(400).json({
      code: "A1",
    });
  }

  const checkPassMatch = await bcrypt.compare(
    password,
    usernameRows[0].password
  );
  if (!checkPassMatch) {
    return res.status(400).json({
      code: "A1",
    });
  }

  if (usernameRows[0].isactive === "disabled") {
    return res.status(400).json({
      code: "A1",
    });
  }

  const task_owner = username;

  // checking if app exists
  const checkAppExist = `SELECT * FROM applications where app_acronym =?`;
  const [checkAppRows, checkAppFields] = await db.execute(checkAppExist, [
    task_app_acronym,
  ]);

  if (checkAppRows.length === 0) {
    return res.status(400).json({
      code: "A2",
    });
  }

  // logging the permission result
  console.log("This is taken from query result of checkAppExist: ", [
    checkAppRows[0].app_permit_doing,
  ]);

  // checking if user that is trying to promote the task to done has appropriate permissions
  const checkPlanAuth = await Checkgroup(task_owner, [
    checkAppRows[0].app_permit_doing,
  ]);
  if (!checkPlanAuth) {
    return res.status(400).json({
      code: "A3",
    });
  }

  const checkTaskInfoSQL = `SELECT * FROM tasks WHERE task_id = ?`;
  const [checkTaskRows, checkTaskFields] = await db.execute(checkTaskInfoSQL, [
    task_id,
  ]);

  if (checkTaskRows.length === 0) {
    return res.status(400).json({
      code: "E1",
    });
  }

  console.log(`Task id task_status : ${checkTaskRows[0].task_status}`);

  if (checkTaskRows[0].task_status !== "doing") {
    return res.status(400).json({
      code: "E2",
    });
  }

  // the following codes are for audit trail log:
  const task_description = checkTaskRows[0].task_description;
  const prevState = checkTaskRows[0].task_status;
  let newState = "done";

  var prevPlan;
  var currentPlan;

  if (checkTaskRows[0].task_plan === null) {
    prevPlan = " ";
    currentPlan = " ";
  } else {
    prevPlan = checkTaskRows[0].task_plan;
    currentPlan = checkTaskRows[0].task_plan;
  }

  const prevNote = checkTaskRows[0].task_notes;

  const currentDate = dayjs();
  const formattedDate = currentDate.format("DD-MM-YYYY HH:mm:ss");

  const notesDelimiter = " ====== ";
  const auditTrailLog = `\n${notesDelimiter} Task promoted from ${prevState} to ${newState} on: ${formattedDate} by user : ${task_owner} ${notesDelimiter}\n Plan Changed from '${prevPlan}' to '${currentPlan}' \n Task description : ${task_description} \n Task notes : \n ${task_notes} \n\n =============================================================== \n`;
  const newNote = auditTrailLog + prevNote;
  // end of audit trail long notes

  // for final sql to update database
  const updateTaskSQL = `UPDATE tasks SET task_notes=?, task_owner=?, task_status=? WHERE task_id=?`;

  const [updateTaskRows, updateTaskFields] = await db.execute(updateTaskSQL, [
    newNote,
    task_owner,
    newState,
    task_id,
  ]);

  if (updateTaskRows.affectedRows === 0) {
    return res.status(400).json({
      code: "E5",
    });
  }

  //getting emails to send to user
  const getUserSQL = `SELECT email FROM accounts WHERE groupname = ? OR groupname LIKE ? OR groupname LIKE ? OR groupname LIKE ?`;
  const [userSQLRow, userSQLFields] = await db.execute(getUserSQL, [
    checkAppRows[0]["app_permit_done"],
    `%,${checkAppRows[0]["app_permit_done"]}`,
    `%,${checkAppRows[0]["app_permit_done"]},%`,
    `${checkAppRows[0]["app_permit_done"]},%`,
  ]);

  console.log("User email : ", userSQLRow);
  const emailArray = userSQLRow.map(({ email }) => email);
  console.log("Email Array: ", emailArray);

  mailTester(
    emailArray,
    `Request for review`,
    `${task_owner} has requested ${task_id} for approval`
  );

  return res.status(200).json({
    code: "S1",
  });
});
