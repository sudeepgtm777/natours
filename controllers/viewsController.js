const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get all the Tour data from the collection
  const tours = await Tour.find();

  // 2) Build the templates

  // 3) Render the template from Tour data

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
  // next();
});

exports.getTour = catchAsync(async (req, res) => {
  // 1) Get all the  data from the collection for requsted tour(Reviews and Guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
