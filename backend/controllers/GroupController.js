const db = require('../config/database');
const catchASyncError = require('../middlewares/catchASyncError');

//creating a new role
exports.createRole = catchASyncError(async (req, res) => {
    const { user_group } = req.body;

    // if user enters invalid group name (empty field)
    if (!user_group) {
        res.status(400).send('Please enter a group');
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