var express = require('express');
var router = express.Router();

// Require controller modules.
var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

// GET home page.
router.get('/', item_controller.index);

// Get request for Item create form.
router.get('/item/create', item_controller.item_create_get);

// POST request for creating Author.
router.post('/item/create', item_controller.item_create_post);

// Get request for one Item.
router.get('/item/:id', item_controller.item_detail);

// Get request for one Category
router.get('/category/:id', category_controller.category_detail);




module.exports = router;