const fs = require('fs');
/**
 * đọc toàn bộ dữ liệu ngay lần đầu tiên khởi động app
 * **/
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/**
 *  Thay vì phải api nào cũng checkID thì sẽ viết 1 middleware cho các api đều phải chạy qua
 * **/
exports.checkID = (req, res, next, val) => {
  try {
    if (val * 1 > tours.length) {
      throw new Error('invalid ID');
    }
  } catch (error) {
    return res.status(404).json({
      status: 'false',
      message: error.message,
    });
  }
  // luôn luôn phải có next để có thể chạy sang middle ware khác
  next();
};

/**
 * Trong middleware luon su dung try catch
 * **/

exports.checkBody = (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      throw new Error('missing name or price');
    }
  } catch (error) {
    return res.status(404).json({
      status: 'false',
      message: error.message,
    });
  }
  next();
};

/**
 * -Xây dựng api : /api/v1/... để sau này còn update thì chỉ cần api/v2
 * -1 get api cần trả về status , trong định dạng cần trả về status , số lượng dữ liệu (result)
 * và data
 * **/
exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

/**
 * muốn thêm tham số thì /:id/:x/:y nếu không muốn lỗi thì thêm /:id/:x/:y?
 * **/
exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newTour = { id: newId, ...req.body.tour };

  tours.push(newTour);

  /**
   * -đang trong 1 fuction nó sẽ chạy trong event loop nên sẽ không bao giờ chặn được
   * event loop để chạy đồng bộ nên phải chạy bất đồng bộ
   * **/
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'create tour success',
        results: 1,
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(500).json({
    message: 'method is not defined',
  });
};
exports.deleteTour = (req, res) => {
  res.status(500).json({
    message: 'method is not defined',
  });
};
