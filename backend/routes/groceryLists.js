const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const GroceryList = require('../models/GroceryList');
const MealPlan = require('../models/MealPlan');

const router = express.Router();

// @route   GET /api/grocery-lists
// @desc    Get user's grocery lists
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (status !== 'all') {
      query.status = status;
    }

    const groceryLists = await GroceryList.find(query)
      .populate('mealPlanId', 'weekStartDate weekEndDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await GroceryList.countDocuments(query);

    res.json({
      success: true,
      data: {
        groceryLists,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get grocery lists error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery lists'
    });
  }
});

// @route   GET /api/grocery-lists/:id
// @desc    Get specific grocery list
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('mealPlanId', 'weekStartDate weekEndDate');

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      });
    }

    res.json({
      success: true,
      data: groceryList
    });
  } catch (error) {
    console.error('Get grocery list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery list'
    });
  }
});

// @route   POST /api/grocery-lists
// @desc    Create new grocery list
// @access  Private
router.post('/', auth, [
  body('mealPlanId')
    .isMongoId()
    .withMessage('Please provide a valid meal plan ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters')
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

    const { mealPlanId, name, items = [] } = req.body;
    const userId = req.user._id;

    // Verify meal plan exists and belongs to user
    const mealPlan = await MealPlan.findOne({
      _id: mealPlanId,
      userId
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    const groceryList = new GroceryList({
      userId,
      mealPlanId,
      name: name || `Grocery List - ${new Date().toLocaleDateString()}`,
      items
    });

    await groceryList.save();

    res.status(201).json({
      success: true,
      message: 'Grocery list created successfully',
      data: groceryList
    });
  } catch (error) {
    console.error('Create grocery list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating grocery list'
    });
  }
});

// @route   POST /api/grocery-lists/generate
// @desc    Generate grocery list from meal plan
// @access  Private
router.post('/generate', auth, [
  body('mealPlanId')
    .isMongoId()
    .withMessage('Please provide a valid meal plan ID')
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

    const { mealPlanId } = req.body;
    const userId = req.user._id;

    // Verify meal plan exists and belongs to user
    const mealPlan = await MealPlan.findOne({
      _id: mealPlanId,
      userId
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    // Generate grocery list from meal plan
    const groceryList = await GroceryList.generateFromMealPlan(mealPlanId, userId);

    res.status(201).json({
      success: true,
      message: 'Grocery list generated successfully',
      data: groceryList
    });
  } catch (error) {
    console.error('Generate grocery list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating grocery list'
    });
  }
});

// @route   PUT /api/grocery-lists/:id
// @desc    Update grocery list
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      });
    }

    const allowedUpdates = ['name', 'items', 'status', 'store', 'notes'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(groceryList, updates);
    await groceryList.save();

    res.json({
      success: true,
      message: 'Grocery list updated successfully',
      data: groceryList
    });
  } catch (error) {
    console.error('Update grocery list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating grocery list'
    });
  }
});

// @route   DELETE /api/grocery-lists/:id
// @desc    Delete grocery list
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      });
    }

    res.json({
      success: true,
      message: 'Grocery list deleted successfully'
    });
  } catch (error) {
    console.error('Delete grocery list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting grocery list'
    });
  }
});

// @route   POST /api/grocery-lists/:id/items
// @desc    Add item to grocery list
// @access  Private
router.post('/:id/items', auth, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name is required and must be less than 100 characters'),
  body('category')
    .isIn(['produce', 'meat-seafood', 'dairy', 'grains', 'bakery', 'pantries', 'frozen', 'beverages', 'snacks', 'other'])
    .withMessage('Invalid category'),
  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),
  body('unit')
    .isIn(['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'piece', 'slice', 'clove', 'pinch', 'dash', 'handful', 'bag', 'box', 'can', 'bottle'])
    .withMessage('Invalid unit'),
  body('estimatedCost')
    .isFloat({ min: 0 })
    .withMessage('Estimated cost must be a positive number')
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

    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      });
    }

    const itemData = {
      ...req.body,
      recipeIds: req.body.recipeIds || []
    };

    await groceryList.addItem(itemData);

    res.json({
      success: true,
      message: 'Item added successfully',
      data: groceryList
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item'
    });
  }
});

// @route   PUT /api/grocery-lists/:id/items/:itemId
// @desc    Update grocery list item
// @access  Private
router.put('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      });
    }

    await groceryList.updateItem(req.params.itemId, req.body);

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: groceryList
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item'
    });
  }
});

// @route   DELETE /api/grocery-lists/:id/items/:itemId
// @desc    Remove item from grocery list
// @access  Private
router.delete('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      });
    }

    await groceryList.removeItem(req.params.itemId);

    res.json({
      success: true,
      message: 'Item removed successfully',
      data: groceryList
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item'
    });
  }
});

// @route   POST /api/grocery-lists/:id/items/:itemId/toggle
// @desc    Toggle item checked status
// @access  Private
router.post('/:id/items/:itemId/toggle', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      });
    }

    await groceryList.toggleItemCheck(req.params.itemId);

    res.json({
      success: true,
      message: 'Item status updated successfully',
      data: groceryList
    });
  } catch (error) {
    console.error('Toggle item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item status'
    });
  }
});

module.exports = router;
