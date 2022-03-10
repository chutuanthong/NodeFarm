module.exports = function (res, status, message, data) {
  if (data.length === 0) {
    throw new Error('Dont have data ');
  }
  res.status(status).json({
    status: message,
    results: data.length,
    data: {
      data,
    },
  });
};
