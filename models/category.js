var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    type: {
        type: String, required: true, maxlength: 30,
        minlength: 3
    }
});

// Virtual for CategorySchema
CategorySchema.virtual('url').get(function () {
    return '/inventory/category/' + this.id;
});

// Export model
module.exports = mongoose.model('Genre', GenreSchema);