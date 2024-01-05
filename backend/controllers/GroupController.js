const db = require('../config/database');
// const catchASyncError = require('../middlewares/catchASyncError');
const catchASyncError = require('../middlewares/catchASyncError');

//creating a new role
exports.createGroup = catchASyncError(async (req, res) => {
    const { user_group } = req.body;

    // if user enters invalid group name (empty field)
    if (!user_group) {
        res.status(400).send('Please enter a group');
    }

    if (user_group.includes(',')) {
        return res.status(400).send('Invalid group name')
    }

    try {
        const sql = `INSERT INTO grouplist (user_group) VALUES (?)`
        const [row, field] = await db.execute(sql, [user_group]);
        return res.status(200).send('Role has been added into database')
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error
        })
    }
})

//getting all user group to populate in the drop down table
exports.getAllUserGroup = catchASyncError( async(req, res) => {
    try {
        const [row, field] = await db.execute('SELECT user_group FROM grouplist')
        res.status(200).json({
            success: true,
            message: row
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error
        })
    }
});

exports.Checkgroup = catchASyncError(async (userId, GroupName) => {
    //get user data from database
    // const [row, fields] = await db.execute(`SELECT user_group FROM accounts WHERE username= ?;`, [userId]);
    // console.log(row);
    // //get current user groups
    // const group = row[0].user_group.split(",");
    // console.log(group);
    // //get intersection of user group and allowed group to see if user is authorized
    // const authorizedGroup = group.filter((val) => val.includes(GroupName));
    // console.log(authorizedGroup);

    // //if len>0 means user is authorized
    // if (authorizedGroup.length > 0) {
    //     console.log(`User: ${userId} is part of ${authorizedGroup}`)
    //     return true;
    // } else {
    //     console.log(`User: ${userId} is not part of ${authorizedGroup}`)
    //     return false;
    // }

    const [row, fields] = await db.execute(`SELECT user_group FROM accounts WHERE username= ?;`, [userId]);
    
    console.log(row);
    
    if (row.length > 0 && row[0].user_group) {
        row[0].user_group = row[0].user_group.split(",");
        console.log('This is the result checkGroup groups: ', row[0].user_group);
        console.log('This is the result checkGroup if user group includes passed value: ', row[0].user_group.includes(GroupName))
        return row[0].user_group.includes(GroupName);
    } else {
        return false
    }
})

// using checkgroup function to implement an API endpoint
exports.CheckingGroup = catchASyncError (async (req, res) => {
    console.log(`this is from checkingGroup: ${req.user.username}`);
    console.log(`this is checkingGroup: ${req.body.user_group}`);
    const username = req.user.username;
    const group = req.body.user_group;
    console.log(`this is checkingGroup: ${username}`);
    console.log(`this is checkingGroup: ${group}`);

    try {
        const result = await this.Checkgroup(username, group)
        console.log('hello r u there', result);
        if (result) {
            return res.status(200).json({
                result: result,
                success: true,
                message: `User: ${username} Group: ${group}`
            })
            
        } else {
            console.log('checkgroup failed');
            return res.status(400).json({
                result: result,
                success: false,
                message: `User: ${username} Group: ${group}`
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
        console.log(error.message);
        return
    }
})