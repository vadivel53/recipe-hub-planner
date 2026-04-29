const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const { protect, adminOnly } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all published recipes (with search & filter)
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: maxCookTime
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of recipes }
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, maxCookTime } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (maxCookTime) query.cookTime = { $lte: parseInt(maxCookTime) };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
    const recipes = await Recipe.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a single recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Recipe detail }
 *       404: { description: Not found }
 */
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar bio');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Recipe created }
 */
router.post('/', protect, [
  body('title').notEmpty().withMessage('Title required'),
  body('description').notEmpty().withMessage('Description required'),
  body('cookTime').isNumeric().withMessage('Cook time must be a number'),
  body('category').notEmpty().withMessage('Category required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const recipe = await Recipe.create({ ...req.body, author: req.user._id });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/recipes/{id}/rate:
 *   post:
 *     summary: Rate a recipe (1-5)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || value < 1 || value > 5)
      return res.status(400).json({ message: 'Rating must be 1-5' });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const existingIdx = recipe.ratings.findIndex(
      r => r.user.toString() === req.user._id.toString()
    );
    if (existingIdx >= 0) {
      recipe.ratings[existingIdx].value = value;
    } else {
      recipe.ratings.push({ user: req.user._id, value });
    }
    await recipe.save();
    res.json({ avgRating: recipe.avgRating, totalRatings: recipe.ratings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all recipes (including unpublished)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
