const express = require('express')
const router = express.Router()
const Listing = require('../models/listing.js')
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js')
const { populate } = require('../models/reviews.js')
const listingController =require("../controllers/listings.js")
const multer  = require('multer')
const {storage} =require("../cloudConfig.js")

const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index)) //listings route show all list
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)  //Create route
)


//New route
router.get('/new', isLoggedIn, listingController.renderNewForm)


router.route("/:id")
.get(wrapAsync(listingController.showListing))   //show route or show individual data
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing))  //Update route
  .delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)) //delete route



//Edit route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editLisitng)
)







module.exports = router
