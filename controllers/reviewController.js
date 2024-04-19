const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  // Send Response to the user
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
