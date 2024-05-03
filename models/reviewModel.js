const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'There must be a review!!!'],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must be associated with tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be associated with user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  /******* This is used for getting data of both tour and user from id ********/
  /*
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'photo user',
  });
  */

  /******* This is used for getting data of  user from id  and only id from tour********/
  this.populate({
    path: 'user',
    select: 'photo user',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = function (tour) {
  this.aggregate([
    {
      $match: { tour: tour },
    },
  ]);
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
