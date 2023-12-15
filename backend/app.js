const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const connectDatabase = require('./config/database')

const dotEnv = require('dotenv');

// setting up config.env file variables
dotEnv.config({
    path : './config/config.env'
});

// Inititalize the app and add middleware
app.set('view engine', 'pug'); // Setup the pug
app.use(bodyParser.urlencoded({extended: true})); // Setup the body parser to handle form submits
app.use(session({secret: 'super-secret'})); // Session setup

// Importing routes
const users = require('./routes/users');

const port = process.env.PORT;
/** App listening on port */
app.listen(port, () => {
  console.log(`Server has started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});