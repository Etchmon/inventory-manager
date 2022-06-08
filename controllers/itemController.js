const { body, validationResult } = require('express-validator');

var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');
const { off } = require('../models/item');

// Display index page on GET
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

// Display Item detail on GET.
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

// Display book create form on GET.
exports.item_create_get = function (req, res, next) {

    // Get all categories for item create.
    async.parallel({
        categories: function (callback) {
            Category.find(callback)
        }
    }, function (err, results) {
        if (err) { return next(err) };
        res.render('item_form', { title: 'Create Item', categories: results.categories });
    });
};

// Handle item create on POST.
exports.item_create_post = [

    // Validate and sanitize the fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Descritpion must not be empty').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must not be empty').trim().isLength({ min: 1 }).escape(),
    body('quantity', 'Quantity must not be empty').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract validations errors from request.
        const errors = validationResult(req);

        // Create a Item object with escaped and trimmed data.
        var item = new Item(
            {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                category: req.body.category
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitize values/error messages.

            // Get all categories for item create
            async.parallel({
                categories: function (callback) {
                    Category.find(callback)
                }
            }, function (err, results) {
                if (err) { return next(err) };
                res.render('item_form', { title: 'Create Item', categories: results.categories, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            item.save(function (err) {
                if (err) { return next(err); }
                // successful - redirect to new item record
                res.redirect(item.url);
            });
        }
    }
];

// Display item delete form on GET.
exports.item_delete_get = function (req, res) {

    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err) };
        if (results.item == null) {
            // No results
            res.redirect('/inventory')
        };
        // Successful, so render.
        res.render('item_delete', {
            title: 'Delete Item',
            item: results.item
        });
    });
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.body.itemid).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err) };

        Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
            // Delete item and redirect to list of items.
            if (err) { return next(err) }
            res.redirect('/inventory')
        })
    });
};