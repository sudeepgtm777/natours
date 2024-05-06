const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/*-------------------------------------*\
  This was used for only testing purpose
\*-------------------------------------*/
/*
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);
*/

/*----------------------------------------*\
  This was used for only testing purpose
  It checked if data contains name or price.
\*----------------------------------------*/
/*
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};
*/

/****** The use of factory model to get all Tours. *******/
exports.getAllTours = factory.getAll(Tour);

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   /*-----------------------------------------*\
//      This code is written in utils folder in
//      apiFeatures File and class with  filter()
//     \*-----------------------------------------*/
//   /*
//     //Build The Query
//     // 1-A) Filtering
//     const queryObj = { ...req.query };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     // 1-B) Advanced Filtering
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     let query = Tour.find(JSON.parse(queryStr));
//     */

//   /*-----------------------------------*\
//      The above code also can be written as:
//     \*-----------------------------------*/
//   /*Method:1*/
//   /*const query = await Tour.find({
//       duration: 5,
//       difficulty: 'easy',
//     });
//     */

//   /*Method:2/
//     /* const query = await Tour.find()
//       .where('duration')
//       .equals(5)
//       .where('difficulty')
//       .equals('easy');
//       */

//   /*-------------------------------------*\
//      This code is written in utils folder in
//      apiFeatures File and class with  sort()
//     \*-------------------------------------*/
//   // 2) Sorting
//   /*
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }
//     */

//   /*----------------------------------------------*\
//      This code is written in utils folder in
//      apiFeatures File and class with  limitFields()
//     \*----------------------------------------------*/
//   // 3) Field Limiting
//   /*
//     if (req.query.fields) {
//       const fields = req.query.fields.split(',').join(' ');
//       query = query.select(fields);
//     } else {
//       query = query.select('-__v');
//     }
//     */

//   /*----------------------------------------------*\
//    This code is written in utils folder in
//    apiFeatures File and class with  paginate()
//    \*----------------------------------------------*/
//   // 4) Pagination
//   /*
//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     if (req.query.page) {
//       const numTours = await Tour.countDocument();
//       if (skip >= numTours) throw new Error('This page does not exist!!');
//     }
//     */

//   //Execute The Query
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   //Send Response
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

/****** The use of factory model to create Tour. *******/
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

/****** This is the use of getTour before combining it in handleFactory *******/
/*
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  // This code is similar to Tour.findOne({ _id: req.params.id})

  if (!tour) {
    return next(new AppError('No tour found with Id!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
*/

/****** The use of factory model to create Tour. *******/
exports.createTour = factory.createOne(Tour);

/****** This is the basic way of creating a Tour *******/
/*
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // There is no requirement of try catch block
  // as it is done in the catchAsync function
  // try {
  //   // const newTour = new Tour({})
  //   // newTour.save()
  //   // Better way
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'Fail',
  //     message: err,
  //   });
  // }
});
*/

/****** The use of factory model to update Tour. *******/
exports.upDateTour = factory.updateOne(Tour);

/****** The use of factory model to delete Tour. *******/
exports.deleteTour = factory.deleteOne(Tour);

/****** This is the refrence on how to delete Tour without the use of model *******/
/*
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with Id!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
*/

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    /*-----------------------------------------------*\
    We can use multiple stages i.e. match in this case.
    \*-----------------------------------------------*/
    /*
      {
        $match: { _id: { $ne: 'EASY' } },
      },
      */
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, //This make id disappear from result
      },
    },
    {
      // $sort: { _id: 1 },
      $sort: { numTourStarts: -1 },
    },
    // {
    //   $limit: 6, //The output will only have 6 document.
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide a valid latitude and longitude in format (lat, lng)',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: tours,
    },
  });
});
