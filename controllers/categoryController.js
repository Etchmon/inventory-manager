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
            Category.findOne(id)
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

// Display form to create a Category
exports.category_create_get = function (req, res, next) {
    res.render('category_form', { title: 'Create Category' });
};

// Handle Category create POST.
exports.category_create_post = [
    //  Validate and sanitize the type field.
    body('type', 'Category type required').trim().isLength({ min: 1 }).escape(),

    // Process the request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Category object with escaped and trimmed data.
        var category = new Category(
            {
                type: req.body.type
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('category_form', {
                title: 'Create Category',
                category: category, errors: errors.array()
            })
            return;
        }
        else {
            // Data from form is valid.
            // Check if Category with same name already exists.
            Category.findOne({ 'type': req.body.type }).exec(function (err, found_category) {
                if (err) { return next(err) };

                if (found_category) {
                    // Category with same name already exists.
                    res.redirect(found_category.url)
                } else {
                    category.save(function (err) {
                        if (err) {
                            return next(err)
                        }
                        //Category saved. redirect to detail page.
                        res.redirect(category.url)
                    });
                }
            });
        }
    }
]