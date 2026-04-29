const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, min: 1, max: 5, required: true },
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  ingredients: [{ name: String, quantity: String }],
  steps: [{ stepNumber: Number, instruction: String }],
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Vegan', 'Other'],
    default: 'Other',
  },
  cookTime: { type: Number, required: true }, // in minutes
  servings: { type: Number, default: 2 },
  imageUrl: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: [ratingSchema],
  isPublished: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

// Virtual: average rating
recipeSchema.virtual('avgRating').get(function () {
  const ratings = Array.isArray(this.ratings) ? this.ratings : [];
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.value, 0);
  return (sum / ratings.length).toFixed(1);
});

recipeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Recipe', recipeSchema);
