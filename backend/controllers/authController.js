const db = require('../config/database');
const catchASyncError = require('../middlewares/catchASyncError');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');

// user login functionality
exports.userLogin = catchASyncError(async (req, res) => {
    const { userId, password } = req.body; 

    //if username or password is not entered
    if (!userId || !password) {
        return res.status(400).send('no login Credentials');
    };

    //checking if username exist in database
    const [row, field] = await db.execute('SELECT * FROM accounts WHERE username = ?', [userId]);

    //if username does not exist in the database there will be no result
    if (row.length == 0) {
        return res.status(400).send('Invalid Credentials');
    };

    //check if password matches entered password
    const isPassMatch = await bcrypt.compare(password, row[0].password);
    if (!isPassMatch) {
        return res.status(401).send('Wrong password Credentials');
        // return res.status(401).json({
        //     success : false,
        //     message : row[0].user_status
        // })
    };

    //checking if user status is active or disabled
    //if disabled don't allow login
    if (row[0].user_status === 'disabled') {
        return res.status(401).send('Account disabled');
    };

    res.status(200).send('Successfully logged in');
//     const tkn = jwt.sign({userId : row[0].username}, process.env.JWT_SECRET, 
//                         {expiresIn : process.env.JWT_EXPIRES_TIME});
    
//     res.status(200).json({
//         succes : true,
//         message : tkn
//     });
});

exports.userLogout = (req, res) => {
    
};
