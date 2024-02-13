const express = require("express");
const app = express();

const dotEnv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const database = require("./config/database");
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");

dotEnv.config({
  path: "./config/config.env",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const user = require("./routes/user");
const auth = require("./routes/auth");
const application = require("./routes/application");

app.use(user);
app.use(auth);
app.use(application);

app.use(errorMiddleware);

//handle unhandled routes
app.all("*", (req, res, next) => {
  res.status(400).json({
    code: "V1",
    message: "Invalid URL",
  });
});

// initialising the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server is started on ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
