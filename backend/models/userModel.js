const db = require('../config/database');

const createUser = async (username, password, email) => {
    const sql = `INSERT INTO accounts (username, email, password) VALUES (?,?,?)`;
    const [results] = await db.execute(query, [username, password, email]);
    return results;
    };

module.exports = { createUser };