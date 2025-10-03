const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, optionalAuth } = require('../middleware/auth');
const Recipe = require('../models/Recipe');

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get recipes with filtering and search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      cuisine,
      difficulty,
      dietaryTags,
      maxPrepTime,
      maxCookTime,
      maxCost,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isPublic: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = cuisine;
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by dietary tags
    if (dietaryTags) {
      const tags = Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags];
      query.dietaryTags = { $in: tags };
    }

    // Filter by prep time
    if (maxPrepTime) {
      query.prepTime = { $lte: parseInt(maxPrepTime) };
    }

    // Filter by cook time
    if (maxCookTime) {
      query.cookTime = { $lte: parseInt(maxCookTime) };
    }

    // Filter by cost
    if (maxCost) {
      query.cost = { $lte: parseFloat(maxCost) };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const recipes = await Recipe.find(query)
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments(query);

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes'
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get specific recipe
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user can view private recipes
    if (!recipe.isPublic && (!req.user || recipe.createdBy._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe'
    });
  }
});

// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Private
router.post('/', auth, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Recipe name is required and must be less than 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('prepTime')
    .isInt({ min: 0 })
    .withMessage('Prep time must be a non-negative integer'),
  body('cookTime')
    .isInt({ min: 0 })
    .withMessage('Cook time must be a non-negative integer'),
  body('servings')
    .isInt({ min: 1, max: 20 })
    .withMessage('Servings must be between 1 and 20'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  body('cuisine')
    .isIn(['american', 'italian', 'mexican', 'asian', 'mediterranean', 'indian', 'french', 'thai', 'chinese', 'japanese', 'korean', 'middle-eastern', 'other'])
    .withMessage('Invalid cuisine type'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('At least one instruction is required'),
  body('nutrition')
    .isObject()
    .withMessage('Nutrition information is required'),
  body('cost')
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const recipeData = {
      ...req.body,
      createdBy: req.user._id
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating recipe'
    });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const allowedUpdates = [
      'name', 'description', 'imageUrl', 'prepTime', 'cookTime', 'servings',
      'difficulty', 'cuisine', 'dietaryTags', 'ingredients', 'instructions',
      'nutrition', 'cost', 'tags', 'isPublic'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(recipe, updates);
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: recipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating recipe'
    });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe'
    });
  }
});

// @route   POST /api/recipes/:id/rate
// @desc    Rate a recipe
// @access  Private
router.post('/:id/rate', auth, [
  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Update rating (simplified - in real app, you'd track individual user ratings)
    const newAverage = ((recipe.rating.average * recipe.rating.count) + rating) / (recipe.rating.count + 1);
    
    recipe.rating.average = Math.round(newAverage * 10) / 10;
    recipe.rating.count += 1;

    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe rated successfully',
      data: {
        average: recipe.rating.average,
        count: recipe.rating.count
      }
    });
  } catch (error) {
    console.error('Rate recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating recipe'
    });
  }
});

// @route   GET /api/recipes/user/:userId
// @desc    Get user's recipes
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find({
      createdBy: req.params.userId,
      isPublic: true
    })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments({
      createdBy: req.params.userId,
      isPublic: true
    });

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user recipes'
    });
  }
});

module.exports = router;
