const express = require('express')
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing.js')
const Review = require('../models/reviews.js')
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isreviewAuthor } = require('../middleware.js');


const reviewController=require("../controllers/reviews.js")

//Reviews post route

router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
)

//Delete review route
router.delete(
  '/:reviewId',
  isLoggedIn,
  isreviewAuthor,
  wrapAsync(reviewController.destroyReview)
)

module.exports= router;