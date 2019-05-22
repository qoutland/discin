var Disc = require('../models/discs');

var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index_get = function(req, res) {
    res.send('NOT IMPLEMENTED Homepage');
};

exports.disc_list = function(req, res, next) {
    const id = req.session.passport.user;
    Disc.find({owner: id})
        .exec(function(err, list_discs) {
            if (err) { return next(err); }
            res.render('disc_list', {title: 'Disc List', disc_list:list_discs});
        })
};

exports.disc_create_get = function(req, res, next) {
    res.render('disc_form');
};

exports.disc_create_post = function(req, res, next) {
    body('brand', 'Brand must not be empty.').isLength({min: 1}).trim();
    body('color', 'Color must not be empty.').isLength({min: 1}).trim();
    body('weight', 'Weight must not be empty.').isLength({min: 1}).trim();
    body('type', 'Type must not be empty.').isLength({min: 1}).trim();

    const newDisc = new Disc({
        owner: req.session.passport.user,
        brand: req.body.brand,
        name: req.body.name,
        color: req.body.color,
        weight: req.body.weight,
        type: req.body.type,
        speed: req.body.speed,
        glide: req.body.glide,
        turn: req.body.turn,
        fade: req.body.fade
    });
    Disc.findOne(newDisc, function(err, success) {
        if (err) {return next(err)}
        if (success == null) {
            newDisc.save(function(err) {
                if (err) { return next(err); }
                res.redirect('/disc')
            });
        }
        res.send('Disc already added')
    })

}

exports.disc_update_get = function(req, res, next) {
    Disc.findById(req.params.id)
        .exec(function(err, disc) {
            if (err) { return next(err); }
            res.render('disc_form', {title: 'Disc List', disc: disc});
        })
};

exports.disc_update_post = function(req, res, next) {
    res.send('Disc Update POST');
}

exports.disc_delete_get = function(req, res, next) {
    Disc.findByIdAndDelete(req.params.id, function deleteDisc(err) {
        if (err) { return next(err); }
        res.redirect('/disc');
    })
};

exports.disc_delete_post = function(req, res, next) {
    Disc.findByIdAndDelete(req.params.id, function deleteDisc(err) {
        if (err) { return next(err); }
        res.redirect('/disc');
    })
}

exports.disc_detail_get = function(req, res, next) {
    res.send('Disc info GET')
};

exports.disc_detail_post = function(req, res, next) {
    res.send('Disc info POST')
}