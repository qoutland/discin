var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
        email: {type: String, unique: true, required: true, trim: true},
        username: {type: String, unique: true, required: true, trim: true},
        password: {type: String, required: true},
        friends: {type: Array, },
        num_discs: {type: Number, default: 0}
});

/*UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {return next();}
    bcrypt.hash(user.password, 10).then((hashedPassword) =>{
        user.password = hashedPassword;
        next();
    })
})*/

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        console.log('User has not modified password')
        return next()
    };
    bcrypt.hash(user.password, bcrypt.genSalt(10, (err) => console.log(err)), null, function(err, hash) {
        if (err) {return next(err);}
        user.password = hash;
        next();
    })
}, function (err) {
    next(err)
});

UserSchema.methods.comparePassword=function(candidatePassword,next){
    console.log(this.password)
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        console.log('password matches: ' + isMatch)
        if(err) return next(err);
        console.log('password matches: ' + isMatch)
        next(null,isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema);