var express = require('express');
var router = express.Router();

// Require controller modules.
var recipe_controller = require('../controllers/recipeController');

// GET home page.
router.get('/', recipe_controller.index);

module.exports = router;