var mongoose = require('mongoose');
var passport = require('passport');
var router = require('express').Router();
var auth = require('../auth');
var User = mongoose.model('User');

router.get('/', auth.optional, (req, res, next) => {
  User.find({}, function(err, users) {
    var userMap = {};
    users.forEach(function(user) {
      userMap[user._id] = user;
    })
    res.send(userMap);
  });
})

//Create a new users
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }
  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new User(user);
  
  finalUser.setPassword(user.password)

  return finalUser.save( function(err) {
    if (err) {
      console.error(err.stack);
      return res.send(err.errmsg);
    }
    res.json({ user: finalUser.toAuthJSON() });
  })
});

//Login an existing user
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;
  console.log(user)
  if (!user){
    return res.json({message: 'No login information found'})
  }
  //Validate input
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) { return next(err); }
    console.log(err);
    if(passportUser) {
      return res.json({ user: passportUser.toAuthJSON() });
    }

    return res.status(400).json(info);
  })(req, res, next);
});

router.post('logout', auth.required, (req, res,next) => {
  const { payload: { id } } = req;

})

//Get the current status of a user (only auth users have access)
router.all('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return User.findById(id)
    .then((user) => {
      if (!user) { return res.sendStatus(400) }
      return res.json({user: user.toAuthJSON() });
    });
});



module.exports = router;
