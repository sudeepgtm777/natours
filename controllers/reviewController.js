const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  // Send Response to the user
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

/****** The use of factory model to create Review. *******/
exports.createReview = factory.createOne(Review);

/****** The use of factory model to update Review. *******/
exports.updateReview = factory.updateOne(Review);

/****** The use of factory model to delete Review. *******/
exports.deleteReview = factory.deleteOne(Review);
