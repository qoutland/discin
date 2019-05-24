var router = require('express').Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/users');
var Disc = require('../models/discs');
//var fs = require('fs');
//var privateKEY  = fs.readFileSync('./private.key');
//var publicKEY  = fs.readFileSync('./public.key');
router.post('/login', function(req, res, next) {
    console.log(req.body)
    User.findOne({$or: [{email: req.body.email}, {username: req.body.email}]})
    .then((user) => {
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch) {
                var token=jwt.sign({userId: user._id, name: user.username}, 'secret', {expiresIn: 86400});
                res.status(200).json({
                    username: user.username,
                    email: user.email,
                    token
                })
            } else {
                res.json({status: 'failed', error: 'Invalid Password'});
            }
        })
    })
    .catch((err) => {
        res.json({status: 'failed', error: 'A user with this email does not exist'});
    })
});

router.post('/signup', function(req, res, next) {
    process.nextTick(function() {
        User.findOne({$or: [
            {email: req.body.email},
            {username: req.body.username}]
        }, function(err,user) {
            if (err) return next(err);
            if (user) {
                return res.json({status:'failed', message: 'An account exists with this email or username' });
            }
            var newUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            });
            newUser.save(function(err) {
                if (err) {return console.log(err)}
                var token=jwt.sign({userId: newUser._id, name: newUser.username}, 'secret', {expiresIn: 86400});
                res.json({
                    username: newUser.username,
                    email: newUser.email,
                    token
                })
            });
        })
    });
});

router.post('/profile', authorized, function(req, res,next) {
    res.json({status: 'success'})
});

router.post('/disc', authorized, function(req, res) {
    Disc.find({owner: req.userId})
    .exec(function(err, list_disc) {
        if (err) {console.log(err)}
        res.json(list_disc)
    });
});

router.post('/disc/create', authorized, function(req,res) {
    /*body('brand', 'Brand must not be empty.').isLength({min: 1}).trim();
    body('color', 'Color must not be empty.').isLength({min: 1}).trim();
    body('weight', 'Weight must not be empty.').isLength({min: 1}).trim();
    body('type', 'Type must not be empty.').isLength({min: 1}).trim();
    */

    const newDisc = new Disc();
    newDisc.owner = req.userId;
    newDisc.brand= req.body.brand;
    newDisc.name = req.body.name;
    newDisc.color = req.body.color;
    newDisc.weight = req.body.weight;
    newDisc.type = req.body.type;
    newDisc.speed = req.body.speed;
    newDisc.glide = req.body.glide;
    newDisc.turn = req.body.turn;
    newDisc.fade = req.body.fade;
    newDisc.purchase_date = req.body.purchase_date;
    Disc.findOne({brand: req.body.brand,
                  name: req.body.name,
                  color: req.body.color,
                  weight: req.body.weight,
                    }, {purchase_date: 0}, function(err, disc) {
        if (err) {return next(err)}
        if (disc) {
            return res.json({status: 'failed', error: 'Disc already exists'})
        }
        newDisc.save(function(err) {
            if (err) { return console.log(err); }
            return res.json({status: 'success', message: 'disc added'})
        });
})
});

router.post('/disc/:id', authorized, function(req,res) {
    Disc.findOne({_id: req.params.id}, function(err, disc) {
        if (err) { return res.json({status: 'failed', error: err}); }
        if(!disc) {
            return res.json({status: 'failed', error: 'Disc not found'});
        }
        return res.json({status: 'success', disc: disc});
    })
});

router.post('/disc/:id/update', authorized, function(req, res) {
    Disc.findByIdAndUpdate(req.params.id, req.body, {}, function(err, book) {
        if (err) return res.json({status: 'failed', error: err})
        return res.json({status: 'success', message: 'Book updated'})
    })
})

router.post('/disc/:id/delete', authorized, function(req,res) {
    Disc.deleteOne({_id: req.params.id}, function(err) {
        if (err) { return res.json({status: 'failed', error: err}); }
        return res.json({status: 'success', message: 'disc deleted'})
    })
});

router.post('/friends', authorized, function(req,res) {
    User.findById(req.userId, function(err, user) {
        if (err) {return res.json({status: 'failed', error: err})}
        if(!user) {return res.json({status: 'failed', error: 'User not found'})}
        User.find({_id: {$ne: req.userId, $nin: user.friends.map(a=>a.id)}},{email:0, password:0, friends:0}, function(err,others) {
            if (err) {return res.json({status: 'failed', error: err})}
            res.json({status: 'success', friends: user.friends, others: others})
        })
    })
});

router.post('/friends/add', authorized, function(req, res) {
    console.log(req.body.id)
    console.log(req.userId)
    User.findById(req.body.id, function(err, friend) {
        console.log('1')
        if (err) {return res.json({status: 'failed', error: err})}
        if(!friend) {return res.json({status: 'failed', error: 'Friend not found'})}
        User.findById(req.userId, function(err, user) {
            console.log('2')
            if (err) {return res.json({status: 'failed', error: err})}
            if(!friend) {return res.json({status: 'failed', error: 'User not found'})}
            user.friends.push({id: friend._id, username: friend.username, num_discs: friend.num_discs, status: 'pending'})
            friend.friends.push({id: user._id, username: user.username, num_discs: user.num_discs, status: 'pending_confirm'})

            user.save(function(err) {
                if (err) {return res.json({status: 'failed', error: err})}
            })
            friend.save(function(err) {
                if (err) {return res.json({status: 'failed', error: err})}
            })
            User.find({_id: {$ne: req.userId, $nin: user.friends.map(a=>a.id)}},{email:0, password:0, friends:0}, function(err,others) {
                if (err) {return res.json({status: 'failed', error: err})}
                res.json({status: 'success', message: 'Requested friend', friends: user.friends, others: others})
            })
        })
        
    })
});

router.post('/friends/remove', authorized, function(req, res) {
    res.json({status: 'success'})
});

router.post('/friends/confirm', authorized, function(req, res) {
    User.findById(req.userId, function(err, user) {
        if (err) {return res.json({status: 'failed', error: err})}
        if(!user) {return res.json({status: 'failed', error: 'User not found'})}
        User.findById(req.body.id, function(err, friend) {
            if (err) {return res.json({status: 'failed', error: err})}
            if(!friend) {return res.json({status: 'failed', error: 'Friend not found'})}
            if (req.body.confirm) {
                user.friends[{id: user._id}].status = 'confirm';
                frien.friends[{id: user._id}].status = 'confirm';
            }
        })
    })
})

function authorized(req, res, next) {
    var token = req.headers['authorization'];
    if(!token) return res.json({status:'failed', message: 'No token'});
    jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            console.log('Failed to validate token')
            return res.json({status: 'failed', message: 'failed to authenticate token.'})
        }
        req.userId = decoded.userId
        next()
    })
}

module.exports = router;