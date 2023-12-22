const express = require('express');
const app = express();

const dotEnv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const database = require('./config/database');

dotEnv.config({
  path : './config/config.env'
});

app.use(bodyParser.urlencoded({ extended : true }));
app.use(cors());
app.use(express.json());

// initialising the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log (`Server is started on ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

const user = require('./routes/User');
const auth = require('./routes/Auth');

app.use(user);
app.use(auth);