const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const { protect } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/planner:
 *   get:
 *     summary: Get current user's meal plan
 *     tags: [Planner]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, async (req, res) => {
  try {
    let plan = await MealPlan.findOne({ user: req.user._id })
      .populate('meals.recipe', 'title imageUrl cookTime category');
    if (!plan) plan = await MealPlan.create({ user: req.user._id, meals: [] });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/planner/add:
 *   post:
 *     summary: Add a meal to the planner
 *     tags: [Planner]
 *     security:
 *       - bearerAuth: []
 */
router.post('/add', protect, async (req, res) => {
  try {
    const { day, mealType, recipeId } = req.body;
    let plan = await MealPlan.findOne({ user: req.user._id });
    if (!plan) plan = await MealPlan.create({ user: req.user._id, meals: [] });

    // Remove existing same slot
    plan.meals = plan.meals.filter(
      m => !(m.day === day && m.mealType === mealType)
    );
    plan.meals.push({ day, mealType, recipe: recipeId });
    await plan.save();

    const populated = await MealPlan.findById(plan._id)
      .populate('meals.recipe', 'title imageUrl cookTime category');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/planner/remove:
 *   delete:
 *     summary: Remove a meal from the planner
 *     tags: [Planner]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/remove', protect, async (req, res) => {
  try {
    const { day, mealType } = req.body;
    const plan = await MealPlan.findOne({ user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    plan.meals = plan.meals.filter(
      m => !(m.day === day && m.mealType === mealType)
    );
    await plan.save();

    const populated = await MealPlan.findById(plan._id)
      .populate('meals.recipe', 'title imageUrl cookTime category');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/planner/clear:
 *   delete:
 *     summary: Clear entire meal plan
 *     tags: [Planner]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/clear', protect, async (req, res) => {
  try {
    await MealPlan.findOneAndUpdate({ user: req.user._id }, { meals: [] });
    res.json({ message: 'Meal plan cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
