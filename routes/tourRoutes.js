const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// This is the use of param to define middleware
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

const checkBody = router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.upDateTour)
  .delete(tourController.deleteTour);

module.exports = router;
