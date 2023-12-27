const jwt = require('jsonwebtoken');
const catchASyncError = require('./catchASyncError');
const db = require('../config/database');

exports.isAuthenticated = catchASyncError(async (req, res, next) => {
    let token;

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

    // check if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // finding user in database that matches token id
    const [row, data] = await db.execute(`SELECT * FROM accounts where username = ?`, [decoded.userId]);

    if (row.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JWT Token'
        })
    }

    row[0].token = token;
    req.user = row[0];

    next();
});

exports.isAuthRole = (req, res) => {
    
};