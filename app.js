if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expressError.js');
// const cookieParser=require("cookie-parser");
const session =require("express-session");
const flash =require("connect-flash");
const mongoStore =require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRoute = require('./routes/listing.js');
const reviewRoute = require('./routes/review.js');
const userRoute = require('./routes/user.js');
const wrapAsync = require('./utils/wrapAsync.js');
const Listing = require('./models/listing.js');



const dbUrl = process.env.ATLASTDB_URL;


main()
  .then(res => {
    console.log('connected to db');
  })
  .catch(err => {
    console.log(err);
  });

async function main () {
  await mongoose.connect(dbUrl ,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  });
};

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public')))
 
const store = mongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOption=session({secret:process.env.SECRET,
  store,
  resave:false, saveUninitialized:true
  ,cookie: {
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
});




app.use(sessionOption);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curUser=req.user || null;
  next();
})

// home route
app.get('/',wrapAsync( async(req, res) => {
  const searchQuery = req.query.q || '';
  const allListings = await Listing.find({
  title: { $regex: searchQuery, $options: 'i' }
});
  res.render("listings/index.ejs", { allListings,searchQuery });
}));

app.get("/userdemo",async(req,res,)=>{
  let fakeUser = new User({
    email:"lalit@gamil.com",
    username:"techno",
  });

  let registerUser= await User.register(fakeUser,"helloworld");
  res.send(registerUser);
});

//routes
app.use('/listings/:id/reviews', reviewRoute)
app.use('/listings', listingRoute)
app.use("/", userRoute)


// app.get("/cookie",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("hi ,i am cokie")
// })

// app.get("/listing", async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:20000,
//         location:"Goa",
//         country:"India"
//     });

//   await sampleListing.save();
//   console.log("sampled was save");
//   res.send("successful listing");
// });

app.all(/.*/, (req, res, next) => {
  // console.log("404 triggered for:", req.originalUrl);
  next(new expressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
  let { status = 500, message = 'Something went wrong' } = err;
  res.status(status).render('listings/error.ejs', { err
   });
})

app.listen(8080, () => {
  console.log('app listening on port 8080')
})
