const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { protect, adminOnly } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, bio, avatar }, { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/bookmarks/{recipeId}:
 *   post:
 *     summary: Toggle bookmark on a recipe
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/bookmarks/:recipeId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.recipeId;
    const idx = user.bookmarks.indexOf(recipeId);
    if (idx >= 0) {
      user.bookmarks.splice(idx, 1);
    } else {
      user.bookmarks.push(recipeId);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/bookmarks:
 *   get:
 *     summary: Get user's bookmarked recipes
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/my-recipes:
 *   get:
 *     summary: Get current user's recipes
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-recipes', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/admin/stats:
 *   get:
 *     summary: Admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const publishedRecipes = await Recipe.countDocuments({ isPublished: true });
    const recentRecipes = await Recipe.find().sort({ createdAt: -1 }).limit(5).populate('author', 'name');
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    res.json({ totalUsers, totalRecipes, publishedRecipes, recentRecipes, recentUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/admin/users:
 *   get:
 *     summary: Get all users (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/admin/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/admin/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
