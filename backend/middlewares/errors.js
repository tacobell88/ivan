const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let error = { ...err };

  if (process.env.NODE_ENV === "development") {
    if (err.code === "ER_DATA_TOO_LONG" && err.sqlMessage) {
      return res.status(400).json({
        code: "E2",
      });
    }
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({
        code: "V2",
      });
    } else {
      // res.status(err.statusCode).json({
      //   success: false,
      //   error: err,
      //   errMessage: err.message,
      //   stack: err.stack,
      // });
      res.status(500).json({
        error: err,
        code: "GG420",
        message: "Internal Server Error",
      });
    }
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;

    // Handling JWT authentication error
    if (err.name === "UnauthorizedError") {
      // jwt authentication error
      return res.status(401).send({ message: "Invalid Token" });
    }

    // Handling Wrong JWT token error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web token is invalid. Try Again!";
      error = new ErrorHandler(message, 500);
    }

    // Handling Expired JWT token error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web token is expired. Try Again!";
      error = new ErrorHandler(message, 500);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error.",
    });
  }

  // res.status(err.statusCode).json({
  //     sucess : false,
  //     message : err.message
  // });
};
