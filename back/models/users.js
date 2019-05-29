var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
        email: {type: String, unique: true, required: true, trim: true},
        username: {type: String, unique: true, required: true, trim: true},
        password: {type: String, required: true},
        friends: {type: Array, },
        num_discs: {type: Number, default: 0},
        requested:[{ 
            id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            username: {type: String, default: ''} }],
        requests: [{ 
            id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            username: {type: String, default: ''} }],
        friends: [{ 
            id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            username: {type: String, default: 'User'} }]
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
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

//init represents an initiator function (user who initiates the action)
UserSchema.methods.init_request=function(id, username, next){
    this.requested.push({id: id, username: username })
    this.save()
    next();
}

UserSchema.methods.init_approve=function(id, username, next){
    console.log('id: '+id + ' username: ' + username)
    console.log(this.requests)
    this.updateOne({_id: id},
        { $pull: { requests: username } })
        .then((err) => {if (err){console.log(err)}})
    this.requests.pull({id: id, username: username});
    console.log(this.requests)
    //this.friends.push({id: id, username: username});
    //this.save();
    next();
}

UserSchema.methods.init_deny=function(id, username, next){
    this.requests.pull({id: id, username: username });
    this.save();
    next();
}

UserSchema.methods.init_remove=function(id, username, next){
    this.friends.pull({id: id, username: username });
    this.save();
    next();
}

UserSchema.methods.init_withdraw=function(id, username, next){
    this.requested.pull({id: id, username: username });
    this.save();
    next();
}

//comp represents completing the other half of the action
UserSchema.methods.comp_request=function(id, username, next){
    this.requests.push({id: id, username: username })
    this.save()
    next();
}

UserSchema.methods.comp_approve=function(id, username, next){
    this.requested.pull({id: id, username: username });
    this.friends.push({id: id, username: username});
    this.save();
    next();
}

UserSchema.methods.comp_deny=function(id, username, next){
    this.requested.pull({id: id, username: username });
    this.save();
    next();
}

UserSchema.methods.comp_remove=function(id, username, next){
    this.friends.pull({id: id, username: username });
    this.save();
    next();
}

UserSchema.methods.comp_withdraw=function(id, username, next){
    this.requests.pull({id: id, username: username });
    this.save();
    next();
}

module.exports = mongoose.model('User', UserSchema);