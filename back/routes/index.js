var router = require('express').Router();
var passport = require('passport');

router.get('/', function(req, res) {
    res.send('Homepage');
});

router.get('/login', function(req, res) {
    res.render('login', {errors: req.body.errors});
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) { return next(err)}
        if (!user) {
            console.log(info)
            return res.render('login', {errors: info})
        }
        req.login(user, function(err) {
            if (err) {return next(err);}
            return res.send({success: true, message: 'authentication succeeded'})
        })
    })(req, res, next);
});

router.get('/signup', function(req, res) {
    res.render('signup', {title: 'Signup'});
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', authorized, function(req, res) {
    res.send('You are logged in');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function authorized(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log(req)
    req.session.redirectTo = req.url;
    res.redirect('/login');
}

module.exports = router;