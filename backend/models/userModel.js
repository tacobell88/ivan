const db = require('../config/database');
const bcrypt = require('bcryptjs');

const createUser = async (username, password, email = null, userGroup = null, userStatus = 'active') => {
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO accounts (username, password, email, user_group, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query (sql, [username, hashPassword, email, userGroup, userStatus,]);
    } catch (err) {
        throw err;
    }
};

const findByUsername = async (username) => {
    try {
        const sql = `SELECT * from accounts WHERE username = ?`;
        const
    } catch (error) {
        
    }
}

module.exports = { createUser };