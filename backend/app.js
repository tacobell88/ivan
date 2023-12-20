const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require ('cors');

const app = express();
const connectDatabase = require('./config/database')

const dotEnv = require('dotenv');

// setting up config.env file variables
dotEnv.config({
    path : './config/config.env'
});

// Inititalize the app and add middleware
app.use(bodyParser.urlencoded({extended: true})); // Setup the body parser to handle form submits
app.use(session({secret: 'super-secret'})); // Session setup
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Importing routes
const users = require('./routes/users');
const admin = require('./routes/admin');
//const auth = require('./routes/auth');

const port = process.env.PORT;
/** App listening on port */
app.listen(port, () => {
  console.log(`Server has started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

app.get ('/', (req, res) => {
  res.send("Welcome to the TMS");
})

app.use('/api/v1', users);
app.use('/api/v1', admin);
//app.use('/api/v1', auth);