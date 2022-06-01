const { body, validationResult } = require('express-validator');

var Recipe = require('../models/recipe');

var async = require('async');
const { off } = require('../models/recipe');

exports.index = function (req, res) {

    async.parallel({
        recipes: function (callback) {
            Recipe.find({}, 'title description ingredients')
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
            title: 'All Recipes',
            recipes: results.recipes
        });
    });
};