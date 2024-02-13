const express = require("express");
const dotEnv = require("dotenv");

dotEnv.config({
  path: "./config/config.env",
});

const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const database = require("./utils/database");
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const user = require("./routes/user");
const auth = require("./routes/auth");
const application = require("./routes/application");

app.use(function (req, res, next) {
  var err = null;
  try {
    decodeURIComponent(req.path);
    // console.log("data: ", decodeURIComponent(req.path));
  } catch (err) {
    return res.status(400).json({
      code: "V1",
    });
  }
  next();
});

app.use(user);
app.use(auth);
app.use(application);

app.use(errorMiddleware);

//handle unhandled routes
app.all("*", (req, res, next) => {
  // console.log("testing error: ", err);
  return res.status(400).json({
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
