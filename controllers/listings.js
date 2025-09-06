const Listing = require('../models/listing')

module.exports.index = async (req, res) => {
  const { q } = req.query;
  let allListings;

  if (q) {
    const regex = new RegExp(q, 'i'); // case-insensitive search
    allListings = await Listing.find({
      $or: [
        { title: regex },
        { location: regex },
        { country: regex },
      ]
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render('listings/index.ejs', { allListings, searchQuery: q });

}

module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs')
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
    .populate({
      path: 'review',
      populate: {
        path: 'author'
      }
    })
    .populate('owner')
  if (!listing) {
    req.flash('error', 'Your Requested Listing Does Not Exits!')
    res.redirect('/listings')
  }
  res.render('listings/show.ejs', { listing })
}

module.exports.createListing = async (req, res) => {
  let url = req.file.path
  let filename = req.file.filename
  console.log(url, '..', filename)

  const newListing = new Listing(req.body.listing)
  newListing.owner = req.user._id
  newListing.image = { url, filename }
  await newListing.save()
  //  console.log("stop");
  req.flash('success', 'New Listing Created!')
  res.redirect('/listings')
}

module.exports.editLisitng = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  if (!listing) {
    req.flash('error', 'Your Requested Listing Does Not Exits!')
    res.redirect('/listings')
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload","/upload/h_200,w_250");
  res.render('listings/edit.ejs', { listing ,originalImageUrl})
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

  if(typeof req.file !=="undefined"){
  let url = req.file.path
  let filename = req.file.filename
  listing.image = { url, filename }
  await listing.save();
  }

  req.flash('success', 'Listing Updated!')
  res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
  // if(!req.body.listing){
  //     throw new expressError(400,"send valid data for listing")
  // }
  let { id } = req.params
  let deleteListing = await Listing.findByIdAndDelete(id)
  req.flash('success', 'Listing Deleted!')
  console.log('deleted list:', deleteListing)

  res.redirect('/listings')
}
