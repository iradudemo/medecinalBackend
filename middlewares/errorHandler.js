// not Found

const ErrorResponse = require("../utils/errorResponse");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler

const errorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  if (error.name === "CastError") {
    const message = `Oops! Nothing related with ${error.value}.`;
    err = new ErrorResponse(message, 404);
  }

  if (error.code === 11000) {
    // const message = `Please avoid Duplicate value ${JSON.stringify(
    //   error.keyValue
    // )}`;
    const message = `${Object.keys(error.keyPattern)[0]} ${
      Object.values(error.keyValue)[0]
    } is Already Exist`;

    err = new ErrorResponse(message, 400);
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    err = new ErrorResponse(message, 400);
  }

  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message || "Server Error" });
};

module.exports = { errorHandler, notFound };
