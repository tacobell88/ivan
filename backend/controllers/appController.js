const db = require('../config/database');
const catchASyncError = require('../middlewares/catchASyncError');
const ErrorHandler = require('../middlewares/errors');
const { Checkgroup } = require('./groupController');


// API to create application
exports.createApp = catchASyncError(async(req, res) => {
    const {app_acronym, app_description, app_rnumber, app_startdate, app_enddate, 
        app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing,
        app_permit_done } = req.body;

        if (!app_startdate) {
            app_enddate = null
        }

        if (!app_enddate) {
            app_startdate = null
        }

        if (app_description == '') {
            app_description = null
        }

        const sql = `INSERT INTO applications (app_acronym, app_description, app_rnumber, app_startdate, app_enddate, 
            app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing,
            app_permit_done) VALUES(?,?,?,?,?,?,?,?,?,?)`;

        const [rows, fields] = await db.execute(sql, [app_acronym, app_description, app_rnumber, app_startdate, app_enddate, 
            app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing,
            app_permit_done]);

        return res.status(200).json({
            success: true,
            message: rows
        })
})

// API to get all application information (mainly for view application)
exports.getAllApp = catchASyncError(async(req, res) => {
    const sql = "SELECT * FROM applications "
    const [rows, fields] = await db.execute(sql);

    return res.status(200).json({
        success : true,
        message : rows
    })
});

exports.getApp = catchASyncError(async(req,res) => {
    const { app_acronym } = req.body
    
    const sql = "SELECT * FROM applications where app_acronym = ?"
    const [rows, fields] = await db.execute(sql, [app_acronym])
})