var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category' }
    }
);

// Virtual for book's URL
ItemSchema.virtual('url').get(function () {
    return '/inventory/item/' + this._id;
});

// Export model
module.exports = mongoose.model('Item', ItemSchema);