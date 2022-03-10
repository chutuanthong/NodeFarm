const mongoose = require('mongoose');
/**
 * schema : tạo ra một lược đồ (schema) cho dữ liệu để có thể connect và thao tấc với mongoose
 * **/

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'must have name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    require: [true, 'durations can not empty'],
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'maxGroupSize can not empty'],
  },
  difficulty: {
    type: String,
    require: [true, 'difficulty can not empty'],
  },
  rattingsAverage: {
    type: Number,
    default: 4.5,
  },
  rattingsQuanity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    require: [true, 'must have price'],
  },
  discount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true, // auto loai bo khoang trang dau va cuoi
  },
  description: {
    type: String,
    trim: true, // auto loai bo khoang trang dau va cuoi
  },
  imageCover: {
    type: String,
    require: [true, 'imageCover have price'],
    trim: true, // auto loai bo khoang trang dau va cuoi
  },
  images: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(), // se chuyen sang giau nhung monggo se tu dong covert sang ngay hom nay
    select: false,
  },
  startDates: [Date],
});

/**
 * Tao model
 * **/

const Tour = mongoose.model('Tour', tourSchema);

// tạo ra instance

// const testTour = new Tour({
//   name: 'The Park center',
//   // ratting: 4.7,
//   price: 497,
// });

// // method save() se tra ve mot promise

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
////////////////////////////////////////////////////

module.exports = Tour;
