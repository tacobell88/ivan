const db = require('../config/database');
const bcrypt = require('bcryptjs');

const catchASyncError = require('../middlewares/catchASyncError');

// display all user function
exports.showAllUser = catchASyncError(async (req, res, next) => {
    try {
        const [rows, fields] = await db.execute(`SELECT * FROM accounts`);
        return res.status(200).json({
            success: true,
            message: rows
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success : false,
            message : error
        });
    }
    //res.status(200).send(rows);
});

// create a new user function
exports.createUser = catchASyncError(async (req, res, next) => {
    var { userId, password, email, user_group } = req.body

    // ****** TO FIX USER_GROUP & EMAIL SHOW NULL IN DATABASE IF NO USER INPUT ****** (FIXED)
    // user group is optional if user does not select a user group, user group will be saved null
    if (!user_group) {
        user_group = null;
    };

    // email is optional so if email is not valid input, user email will be saved as null
    if (!email) {
        email = null;
    };

    // if username and/or password is not valid
    if (!userId || !password) {
        return res.status(400).send('Username/password required');
    };

    // if username is valid input password will be checked
    if (!validatePassword(password)) {
        return res.status(400).send('Invalid Password')
    };

    var user_status = 'active'; //status is always active for new user creation
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO accounts (username, password, email, user_group, user_status) VALUES (?,?,?,?,?)`;
        // console.log(db.execute(sql, [username, hashPassword, email, user_group, user_status]));
        const [row, field] = await db.execute(sql, [userId, hashPassword, email, user_group, user_status]);
        return res.status(200).send('user added into database');
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success : false,
            message : error
        });
    };
});

// admin edits user details
exports.adminEditUser = catchASyncError(async (req, res) => {
    var { userId, password, email, user_group, user_status } = req.body;

    if (password) {
        if (!validatePassword(password)) {
            res.status(400).json({
                success: false,
                message: 'Invalid Password'
            })
        }
        password = await bcrypt.hash(password, 10);
    } else {
        password = null;
    }
    
    // email is optional so if email is not valid input, user email will be saved as null
    if (!email) {
        email = null;
    };

    if (!(user_status === 'active')) [
        user_status = 'disabled'
    ];

    //if password==null then use old password database value, if email==null then set null in database
    const sql = `UPDATE accounts SET email = ?, user_group = ?, user_status = ?,password = COALESCE(?,password) WHERE username = ?;`
    const [row, fields] = await db.execute(sql, [email, user_group, user_status, password, userId]);

    return res.status(200).json({
        success: true,
        message: 'Edit user success'
    })
});

exports.editUserProfile = catchASyncError(async (req, res, next) => {
    const userId = req.user['userId'];
    var { password, email } = req.body;

    if (!email) {
        email = null;
    };

    if (password) {
        if (!validatePassword(password)) {
            res.status(400).json({
                success: false,
                message: 'Invalid Password'
            })
        }
        password = await bcrypt.hash(password, 10);
    } else {
        password = null;
    }

    const sql = `UPDATE accounts SET email = ?, password = COALESCE(?,password) WHERE username = ?;`
    const [row, fields] = await db.execute(sql, [email, password, userId]);

    return res.status(200).json({
        success: true,
        messgae: 'User profile updated'
    })
});

function validatePassword (str) {
    // 8-10 characters, 1 alphabet, 1 number, 1 special character
    const passRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/);
    return passRegex.test(str);
};



    


