var express = require('express');
var router = express.Router();

// Require controller modules.
var item_controller = require('../controllers/itemController');

// GET home page.
router.get('/', item_controller.index);

module.exports = router;