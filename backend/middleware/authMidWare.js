const jwt = require('jsonwebtoken');

const authenToken = (req, res, next) => {
    const tkn = req.headers['authorisation']; // token is sent in authorisation header

    if (!tkn) {
        return res.status(403).send('Token is needed');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
    
    return res.status(200).send('Token is valid');
}

module.exports = { authenToken };