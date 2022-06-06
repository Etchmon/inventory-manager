const { body, validationResult } = require('express-validator');

var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');
const { off } = require('../models/item');

exports.index = function (req, res, next) {

    async.parallel({
        items: function (callback) {
            Item.find({}, 'title description price quantity')
                .sort()
                .populate('category')
                .exec(callback);
        },
        categories: function (callback) {
            Category.find({}, 'type')
                .exec(callback)
        }
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
            items: results.items,
            categories: results.categories
        });
    });
};

exports.item_detail = function (req, res, next) {

    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id)
                .populate('category')
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err) };
        if (results.item == null) {
            // No results
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Succesful, so render
        res.render('item_detail', { title: results.item.title, item: results.item });
    });
};