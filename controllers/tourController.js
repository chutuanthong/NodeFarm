const Tour = require('../models/tourModel');
const Response = require('../components/response');
const APIFeatures = require('../utils/apiFeatures');

// middleware
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

/**
 * -Xây dựng api : /api/v1/... để sau này còn update thì chỉ cần api/v2
 * -1 get api cần trả về status , trong định dạng cần trả về status , số lượng dữ liệu (result)
 * và data
 * **/
exports.getAllTour = async (req, res) => {
  try {
    // BUILD QUERY
    // 1) Filter
    // const queryObj = { ...req.query };
    // console.log(queryObj);
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((field) => delete queryObj[field]);
    // // advanced filter
    // // chuyên object ve String object
    // let queryStr = JSON.stringify(queryObj);
    // // replace fields
    // queryStr = JSON.parse(
    //   queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    // );
    // let query = Tour.find(queryStr);

    // 2) sort
    // if (req.query.sort) {
    //   /**
    //    * 127.0.0.1:3000/api/v1/tours?sort=-price tang dan theo gia
    //    * 127.0.0.1:3000/api/v1/tours?sort=-price giam dan theo gia
    //    * 127.0.0.1:3000/api/v1/tours?sort=-price,-rattingsAverage giam dan theo gia neu bang nhau thi giam dan theo rattingsAverage
    //    * **/

    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // 3) Field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || process.env.LIMIT_PAGINATION * 1;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // const tours = await Tour.find(req.query).where('duration').equals(5);
    Response(res, 200, 'get all tours success', tours);
  } catch (err) {
    Response(res, 400, err.message, {});
  }
};

/**
 * muốn thêm tham số thì /:id/:x/:y nếu không muốn lỗi thì thêm /:id/:x/:y?
 * **/
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    Response(res, 200, 'get one tour success', tour);
  } catch (err) {
    Response(res, 400, err.message, {});
  }
};

/**
 * method create sẽ tra ve 1 promiss nen can phai dung async va await khi su dung async
 * cac properties khong co trong schema se duoc bo qua va khong cho vao database
 * **/

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    Response(res, 200, 'create tour success', tour);
  } catch (err) {
    Response(res, 400, err.message, {});
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // tra ve tai lieu duoc update nhung khong tao ra tai lieu moi
    });
    Response(res, 200, 'update tour success', tour);
  } catch (err) {
    Response(res, 400, err.message, {});
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    Response(res, 200, 'update tour success', tour);
  } catch (err) {
    Response(res, 400, err.message, {});
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { rattingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$rattingsAverage' },
          avgRating: { $avg: '$rattingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    console.log(stats);
    Response(res, 200, 'success', stats);
  } catch (error) {
    Response(res, 400, error.message, {});
  }
};
/**
 * Lay ra cac thang trong nam co truong start date nhieu nhat
 * **/
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const stats = await Tour.aggregate([
      {
        // tach cac phan tu trong 1 mang cua 1 property document thanh cac document khac nhau
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-1-1`),
            $lt: new Date(`${year + 1}-1-1`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numberToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numberToursStarts: -1 },
      },
      // {
      //   $limit: 1,
      // },
    ]);
    Response(res, 200, 'success', stats);
  } catch (error) {
    console.log(error);
    Response(res, 400, error.message, {});
  }
};
