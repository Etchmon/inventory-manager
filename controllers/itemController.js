const { body, validationResult } = require('express-validator');

var Item = require('../models/item');

var async = require('async');
const { off } = require('../models/item');

exports.index = function (req, res) {

    async.parallel({
        items: function (callback) {
            Item.find({}, 'title description price quantity')
                .sort()
                .populate('category')
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err) };
        if (results.items == null) {
            // No results.
            var err = new Error('Items not found');
            err.status = 404;
            return next(err);
        }
        // Successful so render
        res.render('index', {
            title: 'All Items',
            items: results.items
        });
    });
};