const db = require('../config/database');
// const catchASyncError = require('../middlewares/catchASyncError');
const catchASyncError = require('../middlewares/catchASyncError');
const ErrorHandler = require('../utils/errorHandler');

//creating a new role
exports.createGroup = catchASyncError(async (req, res) => {
    const { groupname } = req.body;

    // if user enters invalid group name (empty field)
    if (!groupname) {
        return res.status(400).send('Please enter a group');
    }

    if (groupname.includes(',')) {
        return res.status(400).send('Invalid group name')
    }
    const sql = `INSERT INTO grouplist (groupname) VALUES (?)`
    const [row, field] = await db.execute(sql, [groupname]);
    return res.status(200).send('Role has been added into database')
})

//getting all user group to populate in the drop down table
exports.getAllUserGroup = catchASyncError( async(req, res) => {
    const [row, field] = await db.execute('SELECT groupname FROM grouplist')
    res.status(200).json({
        success: true,
        message: row
    })
});

exports.Checkgroup = catchASyncError(async (userId, GroupName) => {
    const [row, fields] = await db.execute(`SELECT groupname FROM accounts WHERE username= ?;`, [userId]);
    
    console.log('Checkgroup result for all user groups for user: ', row);
    
    if (row.length > 0 && row[0].groupname) {
        row[0].groupname = row[0].groupname.split(",");
        console.log('This is the result checkGroup groups: ', row[0].groupname);
        console.log('This is the result checkGroup if user group includes passed value: ', row[0].groupname.includes(GroupName))
        const result = row[0].groupname.includes(GroupName)
        console.log(`Is the user part of the group ${GroupName} : ${result}`)
        return result;
    } else {
        return false
    }
})

// using checkgroup function to implement an API endpoint
exports.CheckingGroup = catchASyncError (async (req, res, next) => {
    const username = req.user.username;
    const group = req.body.groupname;
    console.log(`(checkinggroup) User to be checked: ${username}`);
    console.log(`(checkinggroup) User groups to be checked: : ${group}`);

    const result = await this.Checkgroup(username, group)
    console.log(`This is the result from executing checking group API: `, result)
    if (result) {
        return res.status(200).json({
            result: result,
            success: true,
            message: `User: ${username} Group: ${group}`
        })
    } else {
        return next(new ErrorHandler('Checking group failed', 400))
    }
})