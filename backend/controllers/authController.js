const db = require('../config/database');
const catchASyncError = require('../middlewares/catchASyncError');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');

// user login functionality
exports.userLogin = catchASyncError(async (req, res) => {
    const { userId, password } = req.body; 

    //if username or password is not entered
    if (!userId || !password) {
        return res.status(400).send('Please enter username/password');
    };

    //checking if username exist in database
    const [row, field] = await db.execute('SELECT * FROM accounts WHERE username = ?', [userId]);

    //if username does not exist in the database there will be no result
    if (row.length == 0) {
        return res.status(400).send('Invalid Login Credentials');
    };

    //check if password matches entered password
    const isPassMatch = await bcrypt.compare(password, row[0].password);
    if (!isPassMatch) {
        return res.status(401).send('Invalid Password');
        // return res.status(401).json({
        //     success : false,
        //     message : row[0].user_status
        // })
    };

    //checking if user status is active or disabled
    //if disabled don't allow login
    if (row[0].user_status === 'disabled') {
        return res.status(401).send('Account is disabled');
    };

    //creating jwt token
    const token = jwt.sign({userId : userId}, process.env.JWT_SECRET, 
                        {expiresIn : process.env.JWT_EXPIRES_TIME});
    
    row[0].token = token;

    res.status(200).json({
        success : true,
        message : 'User is logged in',
        user : row[0],
        token
    });
});

exports.userLogout = catchASyncError(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Log out successfully'
    })
});