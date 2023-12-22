const jwt = require('jsonwebtoken');
const catchASyncError = require('./catchASyncError');

exports.isAuthenticated = catchASyncError(async (req, res, next) => {
    let token;

    // if token is valid then assign it to token variable declared above
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    // if token does not exist return error
    if(!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401));
    }

    // check if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // finding user in database that matches token id
    // req.user = await User.findById(decoded.id);

    next();
});

// exports.isAuthRole = (req, res) => {
    
// };