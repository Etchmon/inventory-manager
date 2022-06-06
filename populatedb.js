#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');


var mongoose = require('mongoose');
const category = require('./models/category');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function itemCreate(title, description, price, quantity, category, cb) {
    itemdetail = { title: title, description: description, price: price, quantity: quantity, category: category }
    var item = new Item(itemdetail)

    item.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Item: ' + item)
        items.push(item)
        cb(null, item)
    });
}

function categoryCreate(type, cb) {
    var category = new Category({
        type: type
    });

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Category: ' + category);
        categories.push(category);
        cb(null, category);
    });
}


function createCategories(cb) {
    async.series([
        function (callback) {
            categoryCreate('Fruit', callback);
        },
        function (callback) {
            categoryCreate('Vegetables', callback);
        },
        function (callback) {
            categoryCreate('Meat', callback);
        },
        function (callback) {
            categoryCreate('Dairy', callback);
        },
        function (callback) {
            categoryCreate('Misc', callback);
        },
    ],
        //optional callback 
        cb)
}

function createItems(cb) {
    async.parallel([
        function (callback) {
            itemCreate('Milk', 'a wonderful dairy product for your cereals and more!', 3.00, 10, categories[3], callback);
        },
        function (callback) {
            itemCreate('Coffee', 'Use to brew a cup of morning magic', 4.00, 20, categories[4], callback);
        },
        function (callback) {
            itemCreate('Steak', '20oz of red meat, perfect for grilling', 8.00, 7, categories[2], callback);
        },
        function (callback) {
            itemCreate('Chicken', 'Healthy chicken breast', 6.00, 12, categories[2], callback);
        },
        function (callback) {
            itemCreate('Carrots', 'a bag of organic carrots', 2.00, 30, categories[2], callback);
        },
        function (callback) {
            itemCreate('Bananas', 'Fresh bananas, peel and enjoy!', 1.00, 24, categories[0], callback);
        },
        function (callback) {
            itemCreate('Cheese', 'The most addictive food on the planet', 5.00, 5, categories[3], callback);
        },
    ],
        //optional callback
        cb)
}

async.series([
    createCategories,
    createItems
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('Items: ' + items);

        }
        // All done, disconnect from database
        mongoose.connection.close();
        console.log('All done!')
    });



