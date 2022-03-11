const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/top-5-Cheap')
  .get(tourController.aliasTopTour, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// router.param('id', tourController.checkID);
router
  .route('/')
  .get(tourController.getAllTour)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
