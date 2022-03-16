module.exports = function (res, status, message, data) {
  res.status(status).json({
    status: message,
    results: data.length,
    data: {
      data,
    },
  });
};
