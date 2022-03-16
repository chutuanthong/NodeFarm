const express = require('express');

const morgan = require('morgan');

const app = express();

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
//import mouting
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouters');
// sử dụng morgan trong development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Moutting : tạo ra các root nhỏ hơn cho router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/**
 * @type : xu ly cac url khong xac dinh
 * @description :
 * */
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `cant fine ${req.originalUrl} on this server `,
  // });

  // const err = new Error(`cant fine ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // su dung next nhu the nay thi se tu dong nhay vao global middleware error
  next(new AppError(`cant fine ${req.originalUrl} on this server`, 404));
});

/**
 * @type : error middleware
 * @description : xu ly toan bo cac loi lien quan den operations errors
 * */
app.use(globalErrorHandler);
module.exports = app;
