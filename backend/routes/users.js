const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('dietaryPreferences')
    .optional()
    .isArray()
    .withMessage('Dietary preferences must be an array'),
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  body('nutritionGoals')
    .optional()
    .isObject()
    .withMessage('Nutrition goals must be an object'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number')
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

    const allowedUpdates = [
      'name', 'dietaryPreferences', 'allergies', 'nutritionGoals', 
      'budget', 'preferences', 'notifications'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', auth, async (req, res) => {
  try {
    // Soft delete - deactivate account
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('maxPrepTime')
    .optional()
    .isInt({ min: 5, max: 300 })
    .withMessage('Max prep time must be between 5 and 300 minutes'),
  body('maxCookTime')
    .optional()
    .isInt({ min: 5, max: 300 })
    .withMessage('Max cook time must be between 5 and 300 minutes'),
  body('preferredCuisines')
    .optional()
    .isArray()
    .withMessage('Preferred cuisines must be an array'),
  body('difficulty')
    .optional()
    .isArray()
    .withMessage('Difficulty must be an array')
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

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
});

// @route   PUT /api/users/notifications
// @desc    Update notification preferences
// @access  Private
router.put('/notifications', auth, [
  body('mealReminders')
    .optional()
    .isBoolean()
    .withMessage('Meal reminders must be a boolean'),
  body('groceryReminders')
    .optional()
    .isBoolean()
    .withMessage('Grocery reminders must be a boolean'),
  body('weeklyReports')
    .optional()
    .isBoolean()
    .withMessage('Weekly reports must be a boolean')
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

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notifications: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: user.notifications
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification preferences'
    });
  }
});

module.exports = router;
