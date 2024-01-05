const jwt = require('jsonwebtoken');
const catchASyncError = require('./catchASyncError');
const db = require('../config/database');
const {Checkgroup} = require('../controllers/groupController');

exports.isAuthenticated = catchASyncError(async (req, res, next) => {
    let token;
    console.log('this is req.headers info from isAuthenticated: ', req.headers.authorization);
    // if token is valid then assign it to token variable declared above
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    // if token does not exist return error
    if(!token) {
        // return next(new ErrorHandler('Login first to access this resource.', 401));
        return res.status(401).json({
            success: false,
            message: 'Login first to use this resource'
        })
    }

    var decoded = '';
    // check if token is valid
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'User authentication failed'
        })
    }
    
    // finding user in database that matches token id
    const [row, data] = await db.execute(`SELECT * FROM accounts where username = ?`, [decoded.userId]);
    if (row[0].user_status == 'disabled') {
        
    }

    if (row.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Token'
        })
    }

    row[0].token = token;
    req.user = row[0];
    req.user.userId = decoded.userId;

    next();
});

exports.isAuthRole = (groups) => {
    return catchASyncError(async (req, res, next) => {
        console.log('isAuthRole username:', req.user.username, 'Groups:', groups)
        const auth = await Checkgroup(req.user.username, groups);
        console.log('isAuthRole response: ',auth);
        if (!auth) {
            return res.status(400).json({
                success: false,
                message: 'User not allowed to view this resource'
            })
        } else {
            // return res.status(200).json({
            //     success: true,
            //     messsage: 'User is authorised'
            // })
            return next();
        }
    })
};