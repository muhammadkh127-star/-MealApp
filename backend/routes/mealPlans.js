const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');

const router = express.Router();

// @route   GET /api/meal-plans
// @desc    Get user's meal plans
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    const mealPlans = await MealPlan.find(query)
      .populate('meals.recipe')
      .sort({ weekStartDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MealPlan.countDocuments(query);

    res.json({
      success: true,
      data: {
        mealPlans,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get meal plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plans'
    });
  }
});

// @route   GET /api/meal-plans/:id
// @desc    Get specific meal plan
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('meals.recipe');

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plan'
    });
  }
});

// @route   POST /api/meal-plans
// @desc    Create new meal plan
// @access  Private
router.post('/', auth, [
  body('weekStartDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('meals')
    .isArray()
    .withMessage('Meals must be an array')
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

    const { weekStartDate, meals = [] } = req.body;
    const userId = req.user._id;

    // Calculate week end date
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Validate and populate meal data
    const validatedMeals = [];
    for (const meal of meals) {
      if (meal.recipe) {
        const recipe = await Recipe.findById(meal.recipe);
        if (!recipe) {
          return res.status(400).json({
            success: false,
            message: `Recipe not found: ${meal.recipe}`
          });
        }

        const servings = meal.servings || 1;
        validatedMeals.push({
          name: meal.name || recipe.name,
          type: meal.type,
          dayOfWeek: meal.dayOfWeek,
          recipe: recipe._id,
          servings,
          calories: Math.round((recipe.nutrition.calories / recipe.servings) * servings),
          cost: Math.round((recipe.cost / recipe.servings) * servings * 100) / 100,
          notes: meal.notes
        });
      }
    }

    const mealPlan = new MealPlan({
      userId,
      weekStartDate: startDate,
      weekEndDate: endDate,
      meals: validatedMeals
    });

    await mealPlan.save();
    await mealPlan.populate('meals.recipe');

    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('Create meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating meal plan'
    });
  }
});

// @route   PUT /api/meal-plans/:id
// @desc    Update meal plan
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    const allowedUpdates = ['meals', 'preferences'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(mealPlan, updates);
    await mealPlan.save();
    await mealPlan.populate('meals.recipe');

    res.json({
      success: true,
      message: 'Meal plan updated successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('Update meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating meal plan'
    });
  }
});

// @route   DELETE /api/meal-plans/:id
// @desc    Delete meal plan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meal plan'
    });
  }
});

// @route   POST /api/meal-plans/:id/meals
// @desc    Add meal to meal plan
// @access  Private
router.post('/:id/meals', auth, [
  body('recipe')
    .isMongoId()
    .withMessage('Please provide a valid recipe ID'),
  body('type')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  body('dayOfWeek')
    .isInt({ min: 0, max: 6 })
    .withMessage('Day of week must be 0-6'),
  body('servings')
    .isInt({ min: 1 })
    .withMessage('Servings must be at least 1')
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

    const { recipe, type, dayOfWeek, servings, notes } = req.body;

    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    const recipeDoc = await Recipe.findById(recipe);
    if (!recipeDoc) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const mealData = {
      name: recipeDoc.name,
      type,
      dayOfWeek,
      recipe: recipeDoc._id,
      servings,
      calories: Math.round((recipeDoc.nutrition.calories / recipeDoc.servings) * servings),
      cost: Math.round((recipeDoc.cost / recipeDoc.servings) * servings * 100) / 100,
      notes
    };

    await mealPlan.addMeal(mealData);
    await mealPlan.populate('meals.recipe');

    res.json({
      success: true,
      message: 'Meal added successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('Add meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding meal'
    });
  }
});

// @route   DELETE /api/meal-plans/:id/meals/:mealId
// @desc    Remove meal from meal plan
// @access  Private
router.delete('/:id/meals/:mealId', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    await mealPlan.removeMeal(req.params.mealId);
    await mealPlan.populate('meals.recipe');

    res.json({
      success: true,
      message: 'Meal removed successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('Remove meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing meal'
    });
  }
});

module.exports = router;
