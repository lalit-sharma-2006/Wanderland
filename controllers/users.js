const User = require('../models/user.js')

module.exports.renderSignupFrom=(req, res) => {
  res.render('users/signup.ejs')
}

module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body
      const newUser = new User({ username, email })
      const registeredUser = await User.register(newUser, password)
      console.log(registeredUser)
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
         req.flash('success', 'Welcome to wanderlust')
      res.redirect('/listings')
      })
    } catch (e) {
      req.flash(
        'error',
        'A user with the given username is already registered!'
      )
      res.redirect('/signup')
    }
  };

  module.exports.renderLoginForm=(req, res) => {
  res.render('users/login.ejs')
};

module.exports.login=async (req, res) => {
    req.flash("success","Welcome to Wanderlust! You are logged in!")
    let redirect =res.locals.redirectUrl ||"/listings"
    res.redirect(redirect);
  };

  module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{if(err)
        return next(err);
        req.flash("success","Logged you out!");
    res.redirect("/listings");
    });
};