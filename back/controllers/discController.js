var Disc = require('../models/discs');

var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index_get = function(req, res) {
    res.send('NOT IMPLEMENTED Homepage');
};

exports.disc_list = function(req, res, next) {
    const { payload: { id } } = req;
    Disc.find({owner: id})
        .exec(function(err, list_discs) {
            if (err) { return next(err); }
            res.json(list_discs);
        })
};

exports.disc_create_get = function(req, res, next) {
    res.send('Disc Create GET');
};

exports.disc_create_post = function(req, res, next) {
    console.log('Made it to the top')
    const { payload: { id } } = req;
    const {body: { disc } } = req;
    //const user = User.findById(id)
    disc.owner = id;
    console.log(disc);
    const newDisc = new Disc(disc);
    console.log('Created new disc object')
    newDisc.save(function(err) {
        if (err) { return next(err)}
        res.send('Disc created')
    });
}

exports.disc_update_get = function(req, res, next) {
    res.send('Disc Update GET');
};

exports.disc_update_post = function(req, res, next) {
    res.send('Disc Update POST');
}

exports.disc_delete_get = function(req, res, next) {
    res.send('Disc Delete GET');
};

exports.disc_delete_post = function(req, res, next) {
    Disc.findByIdAndDelete(req.body.discid, function(err) {
        if (err) { return next(err); }
        res.send('Disc Deleted');
    })
}

exports.disc_detail_get = function(req, res, next) {
    res.send('Disc info GET')
};

exports.disc_detail_post = function(req, res, next) {
    res.send('Disc info POST')
}