class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);
    // advanced filter
    // chuyên object ve String object
    let queryStr = JSON.stringify(queryObj);
    // replace fields
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    this.query.find(queryStr);
    return this;
    // let query = Tour.find(queryStr);
  }

  sort() {
    if (this.queryString.sort) {
      /**
       * 127.0.0.1:3000/api/v1/tours?sort=-price tang dan theo gia
       * 127.0.0.1:3000/api/v1/tours?sort=-price giam dan theo gia
       * 127.0.0.1:3000/api/v1/tours?sort=-price,-rattingsAverage giam dan theo gia neu bang nhau thi giam dan theo rattingsAverage
       * **/

      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit =
      this.queryString.limit * 1 || process.env.LIMIT_PAGINATION * 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
