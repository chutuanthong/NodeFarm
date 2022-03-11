const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
/**
 *
 * schema : tạo ra một lược đồ (schema) cho dữ liệu để có thể connect và thao tấc với mongoose
 * **/

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'maximum length '],
      minlength: [10, 'minimum length '],
      validate: [validator.isAlpha, 'Name must only contain characters'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty can not empty',
      },
    },
    rattingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rangting must be above 1.0'],
      max: [5, 'rating must be below 5.0'],
    },
    rattingsQuanity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, 'must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // chi su dung this khi tao ra 1 new document
          return val < this.price;
        },
        message: 'Discount price (VAL) should below than price',
      },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // xac dinh option
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * @type : document middleware
 * @action : chay truoc khi chuc nang .save() va .create() .insertMany() duoc su dung
 * **/

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * @type : document middleware
 * @action : chay sau khi chuc nang .save() va .create() .insertMany() duoc su dung
 * **/
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

/**
 * @type : Query middleware
 * @description : thuc hien truoc hoac sau khi co 1 truy van query trong mongo
 * @/^find/ : thuc hien cho tat cac cac truy van bat dau = fine : fineOne ,fine, ..
 * */
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  // tim cac doc co secretTour !== true
  this.find({ secretTour: { $ne: true } });
  next();
});

/**
 * @type : Aggregation middleware
 * @description : thuc hien truoc hoac sau khi co 1 truy van Aggregation trong mongo
 * */
tourSchema.pre('aggregate', function (next) {
  // them 1 truy van vao dau pipeline : tim cac phan tu co secretTour khong phai true
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
/**
 * Tao model
 * **/

// tao thuoc tinh ao nen dung regular function thi se su dung duoc tu khoa this chu khong dung arrow hay callback
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 * @type : EXECUTE QUERY
 * @description :
 * */

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
