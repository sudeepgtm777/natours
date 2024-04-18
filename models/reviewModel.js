const mongoose = require('mongoose');

const reviewSchema = new moongose.Schema({
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
    type: moongose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must be associated with tour'],
  },
});

const Review = moongose.model('Review', reviewSchema);

module.exports = Review;
