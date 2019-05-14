const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, (email, password, done) => {
    Users.findOne({ email: email }, function(err, user) {
        if (err) {return done(err); }
        if (!user) {return done(null, false, {message: 'Incorrect username'}); }
        if (!user.validatePassword(password)) {return done(null, false, {message: 'Incorrect password'}); }
        return done(null, user);
    })
}));