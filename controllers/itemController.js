const { body, validationResult } = require('express-validator');

var Item = require('../models/item');

var async = require('async');
const { off } = require('../models/item');

exports.index = function (req, res) {

    async.parallel({
        items: function (callback) {
            Item.find({}, 'title description price')
                .sort()
                .populate('categories')
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err) };
        // if (results.recipes == null) {
        //     // No results.
        //     var err = new Error('Recipes not found');
        //     err.status = 404;
        //     return next(err);
        // }
        // Successful so render
        res.render('index', {
            title: 'All Items',
            recipes: results.items
        });
    });
};