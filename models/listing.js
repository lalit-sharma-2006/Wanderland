const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./reviews.js')

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
  url: { type: String, required: true },
  filename: { type: String, required: true }
},
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

listingSchema.post('findOneAndDelete', async listing => {
  await Review.deleteMany({ _id: { $in: listing.review } })
})

const Listing = new mongoose.model('Listing', listingSchema)
module.exports = Listing
