const db = require('../config/database');
const catchASyncError = require('../middlewares/catchASyncError');
const ErrorHandler = require('../utils/errorHandler');
const { Checkgroup } = require('./groupController');

function validRnumber (str) {
    const validRegex = new RegExp(/^[1-9]\d*$/);
    return validRegex.test(str);
}

function validateInput (str) {
    // this regex is to check alpha / alpha numeric only (no special characters) and less than 45 characters
    const validRegex = new RegExp(/^[A-Za-z0-9 ]{0,45}$/);
    return validRegex.test(str);
}

// API to create application
exports.createApp = catchASyncError(async(req, res, next) => {
    var { app_acronym, 
        app_description, 
        app_rnumber, 
        app_startdate, 
        app_enddate, 
        app_permit_create, 
        app_permit_open,
        app_permit_todolist, 
        app_permit_doing,
        app_permit_done } = req.body;
        
        if (app_rnumber == '') {
            throw next(new ErrorHandler('App rnumber is required', 400))
        };
        
        // regex validation for rnumber to be within constraints
        if (!validRnumber(app_rnumber)) {
            throw next(new ErrorHandler('App rnumber has to be more than 0 and a whole number',400))
        }

        if (!app_acronym || app_acronym.trim() == '') {
            throw next(new ErrorHandler('App acronym is required', 400))
        };

        if (app_acronym.length > 45 || !validateInput(app_acronym)) { 
            throw next(new ErrorHandler('App acronym has to have less than 45 characters and no special symbols', 400))
        }

        if (!app_permit_create || !app_permit_open || !app_permit_todolist || !app_permit_doing || !app_permit_done) {
            throw next(new ErrorHandler('App permissions are required', 400))
        };

        if (!app_startdate) {
            throw next(new ErrorHandler('App requires a start date', 400))
        };

        if (!app_enddate) {
            throw next(new ErrorHandler('App requires a end date', 400))
        };

        if (app_description == '') {
            app_description = null
        };

        const sql = `INSERT INTO applications (app_acronym, app_description, app_rnumber, app_startdate, app_enddate, 
            app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing,
            app_permit_done) VALUES(?,?,?,?,?,?,?,?,?,?)`;

        const [rows, fields] = await db.execute(sql, [app_acronym, app_description, app_rnumber, app_startdate, app_enddate, 
            app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing,
            app_permit_done]);
        
        //not sure if this function will be needed
        const sql2 = `SELECT * from applications WHERE app_acronym =?`

        const [rows2, fields2] = await db.execute(sql2, [app_acronym])

        return res.status(200).json({
            success: true,
            message: 'Application has been added successfully',
            data: rows2[0]
        });
})

// API to get all application information (mainly for view application)
exports.getAllApp = catchASyncError(async(req, res, next) => {
    const sql = "SELECT * FROM applications "
    const [rows, fields] = await db.execute(sql);
    
    if (!rows.length) {
        throw next(new ErrorHandler('Error retrieving plans', 400))
    }

    return res.status(200).json({
        success : true,
        message : `Retrieved ${rows.length} applications successfully`,
        data : rows
    })
});

exports.getApp = catchASyncError(async(req,res) => {
    const { app_acronym } = req.body

    // const sql = "SELECT * FROM applications WHERE app_acronym = ?"
    const sql = "SELECT app_acronym, app_description, app_rnumber, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done FROM applications WHERE app_acronym = ?"
    const [rows, fields] = await db.execute(sql, [app_acronym])

    return res.status(200).json({
        success : true,
        message : `Retrieved app: '${app_acronym}' successfully`,
        data : rows[0]
    })
})


exports.editApp = catchASyncError(async(req,res) => {
    var { app_acronym, 
        app_description, 
        app_startdate, 
        app_enddate, 
        app_permit_create, 
        app_permit_open,
        app_permit_todolist, 
        app_permit_doing,
        app_permit_done } = req.body;

        const sql = `UPDATE accounts SET app_description=?,app_startdate=?, app_enddate=?, app_permit_create=?, app_permit_open=?, app_permit_todolist=?, app_permit_doing=?, app_permit_done=? WHERE app_acronym =?`;
        
        const [rows, fields] = await db.execute(sql, [app_description, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done, app_acronym]);

        return res.status(200).json({
            success: true,
            message: `Application: ${app_acronym} edited successfully`
        })
})

// exports.createPlan = catchASyncError(async(req,res) => {
    
//     // figure out how pass app_acronym can be passed
//     const app_acronym = req.body;
//     const { plan_mvp_name, plan_startdate, plan_enddate } = req.body

//     const sql = `INSERT INTO plans(plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym) VALUES(?,?,?,?)`
//     const [rows, fields] = await db.execute(sql, [plan_mvp_name, plan_startdate, plan_enddate, app_acronym])
// })

// getting user groups for app permissions for different states
// Open state app permissions - PM
// ToDo state app permssions - Dev
// Doing state app permssions - Dev
// Done state app permssions -PL
// =============================== WORK IN PROGRESS ====================================
exports.getAppPermissions = catchASyncError(async(req, res) =>{                      //
    const {} = req.body                                                             // 
})                                                                                 //
// =============================== WORK IN PROGRESS ================================


// --------------------------------- START OF PLAN RELATED API ----------------------------------
// to create a plan for the specific application
// *** ADDITIONAL INFO: user is only allowed to create a 
exports.createPlan = catchASyncError(async(req,res, next) => {
    
    // app_acronym should be sent back to the backend so that we know which app we are creating plans for
    var { plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym } = req.body;

    if (!plan_mvp_name || plan_mvp_name.trim() == '') {
        throw next(new ErrorHandler('Plan name is required', 400))
    }

    if (!validateInput(plan_mvp_name)) {
        throw next(new ErrorHandler('Plan name has to have less than 45 characters and no special symbols',400))
    }

    if (!plan_startdate) {
        throw next(new ErrorHandler('Plan requires a start date', 400))
    }

    if (!plan_enddate) {
        throw next(new ErrorHandler('Plan requires a end date', 400))
    }

    // app permissions have to be check that user contains the role that is in the app_permit_create state

    const sql = `INSERT INTO plans (plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym) VALUES (?,?,?,?)`
    const [rows, fields] = await db.execute(sql, [plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym])

    // to return data of newly added plan for application in json fomat
    const sql2 = `SELECT * from plans WHERE plan_mvp_name =? AND plan_app_acronym =?`

    const [rows2, fields2] = await db.execute(sql2, [plan_mvp_name, plan_app_acronym])

    return res.status(200).json({
        success: true,
        message: `Plan for '${plan_app_acronym}' added successfully`,
        data: rows2[0]
    })

})

// getting all plans relating to application
exports.getAllPlans = catchASyncError(async(req,res,next) => {
    // requires plan_app_acronym which should be pre determined after user selects on the specific app to view plan
    const { plan_app_acronym } = req.body

    const sql = `SELECT * FROM plans WHERE plan_app_acronym =?`
    const [rows, fields] = await db.execute(sql, [plan_app_acronym])

    if (!rows.length) {
        throw next(new ErrorHandler('There are no plans for this application', 400))
    }

    return res.status(200).json({
        success: true,
        message: `Plans for '${plan_app_acronym}' retrieved successfuly`,
        data: rows
    })
})

//getting specific plan relating to application
exports.getPlan = catchASyncError(async(req,res, next) => {
    const { plan_mvp_name, plan_app_acronym } = req.body

    const sql = `SELECT * FROM plans WHERE plan_mvp_name =? AND plan_app_acronym=?`
    const [rows, fields] = await db.execute(sql,[plan_mvp_name, plan_app_acronym])

    if (!rows.length) {
        throw next(new ErrorHandler('Plan does not exist', 400))
    }

    return res.status(200).json({
        success: true,
        message: 'Plan retrieved successfully',
        data: rows[0]
    })

})

exports.editPlan = catchASyncError(async(req,res,next) => {
    const {plan_mvp_name, plan_startdate, plan_enddate} = req.body

    if (!plan_startdate) {
        plan_startdate = null
    };

    if (!plan_enddate) {
        plan_enddate = null
    };

    const sql = `UPDATE plans SET plan_startdate =?, plan_enddate WHERE plan_mvp_name =?`;
    const [rows, fields] = await db.execute(sql, [plan_startdate, plan_enddate, plan_mvp_name])

    if (!rows.length) {
        throw next(new ErrorHandler('Failed to edit plan', 400))
    }

    return res.status(200).json({
        success: true,
        message: `Plan '${plan_mvp_name}' edited successfully`
    })
})

// --------------------------------- END OF PLAN RELATED API ----------------------------------