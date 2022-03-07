const express = require('express');

const morgan = require('morgan');

const app = express();

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

module.exports = app;
