const { INTERNAL_SERVER_ERROR_MESSAGE } = require('../utils/constants');

module.exports.errorHandler = ((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : message,
    });
  next();
});
