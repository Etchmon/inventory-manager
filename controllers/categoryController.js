var mongoose = require('mongoose');
var Item = require('../models/item');
var Category = require('../models/category');

const { body, validationResult } = require('express-validator');

var async = require('async');
const { off } = require('../models/item');

// Display detail page for a specific Category
exports.category_detail = function (req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);

    async.parallel({
        category: function (callback) {
            Category.find(id)
                .exec(callback);
        },
        items: function (callback) {
            Item.find({ 'category': id })
                .exec(callback)
        }
    }, function (err, results, next) {
        if (err) { return next(err); }
        if (results.category == null) {
            //No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        //Succesful, so render
        res.render('category_detail', { title: 'Category Detail', category: results.category, items: results.items });
    });
};