const express = require('express');
const { createUser } = require('../models/userModel');
const router = express.Router();

router.get ('/userGroup', (req, res) => {

});

router.post ('/createUser', async (req, res) => {
    try {
        const { username, password, email, userGroup } = req.body;

        // checking for mandatory fields
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const result = await createUser (username, password, email, userGroup);
        res.status(201).send(`'${username} created successfully`);
    } catch (err) {
        res.status(500).send(`Error creating user: ${err.message}`);
    }
});

module.exports = router;