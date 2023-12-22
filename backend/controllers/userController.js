const db = require('../config/database');
const catchASyncError = require('../middlewares/catchASyncError');
const bcrypt = require('bcryptjs');

// validating password input when creating a new user
function passwordChecker (str) {
    // 8-10 characters, 1 alphabet, 1 number, 1 special character
    const passRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/);
    return passRegex.test(str);
};

// display all user function
exports.showAllUser = catchASyncError(async (req, res, next) => {
    try {
        const [rows, field] = await db.execute(`SELECT * FROM accounts`);
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
    const { username, password, user_group, email} = req.body

    // ****** TO FIX USER_GROUP & EMAIL SHOW NULL IN DATABASE IF NO USER INPUT
    // user group is optional if user does not select a user group, user group will be saved null
    if (!user_group) {
        user_group == null;
    };

    // email is optional so if email is not valid input, user email will be saved as null
    if (!email) {
        email == null;
    };

    // if username and/or password is not valid
    if (!username || !password) {
        return res.status(400).send('Username/password required');
    };

    // if username is valid input password will be checked
    if (!passwordChecker(password)) {
        return res.status(400).send('Invalid Password')
    };

    var user_status = 'active'; //status is always active for new user creation
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO accounts (username, password, email, user_group, user_status) VALUES (?,?,?,?,?)`;
        // console.log(db.execute(sql, [username, hashPassword, email, user_group, user_status]));
        const [row, field] = await db.execute(sql, [username, hashPassword, email, user_group, user_status]);
        return res.status(200).send('user added into database');
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success : false,
            message : error
        });
    };
});

exports.toggleUserStatus = catchASyncError(async (req, res) => {
    const { username, user_status } = req.body;
    
    const sql = `UPDATE accounts SET user_status = '?' WHERE username = '?'`
});