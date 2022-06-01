var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RecipeSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        ingredients: { type: String, required: true },
        instructions: [{ type: String, required: true }],
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
        author: { type: Schema.Types.ObjectId, ref: 'User' }
    }
);

// Virtual for book's URL
RecipeSchema.virtual('url').get(function () {
    return '/cookbook/recipe/' + this._id;
});

// Export model
module.exports = mongoose.model('Recipe', RecipeSchema);