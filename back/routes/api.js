var router = require('express').Router();
var passport = require('passport');

router.get('/', function(req, res) {
    res.send('Homepage');
});

router.get('/login', function(req, res) {
    res.json({errors: req.body.errors});
});

router.post('/login', passport.authenticate('local-login', {}),
    function(req, res, next) {
        var redirectTo = req.session.redirectTo || '/profile';
        delete req.session.redirectTo;
        res.json({"status": "logged in"});
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