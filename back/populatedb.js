console.log('Script is used to populate some data in the database: node populatedb mongodb://user:password@dbip/db_name?retryWrite=true')

var userArgs = process.argv.slice(2) //Read in 2 user arguments

var async = require('async')
var User = require('./models/users');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];

function userCreate(email, username, password, cb) {
    userdetail = {email:email, username:username, password:password}

    var user = new User(userdetail);

    user.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + user);
        users.push(user);
        cb(null, user)
    });
}

function createUsers(cb) {
    async.series([
        function(callback){
            userCreate('test@gmail.com', 'test', 'test_password', callback);
        },
        function(callback){
            userCreate('test1@gmail.com', 'test1', 'test1_password', callback);
        },
        function(callback){
            userCreate('test2@gmail.com', 'test2', 'test2_password', callback);
        },
    ], cb);
}

async.series([
    createUsers,
],
function(err, results) {
    if (err) {console.log('FINAL ERR: ' + err);}
    else { console.log('Users ' + users)}
    mongoose.connection.close();
})