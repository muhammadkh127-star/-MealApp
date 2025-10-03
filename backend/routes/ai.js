const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const MealPlan = require('../models/MealPlan');

const router = express.Router();

// @route   POST /api/ai/generate-meal-plan
// @desc    Generate AI-powered meal plan
// @access  Private
router.post('/generate-meal-plan', auth, [
  body('weekStartDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object')
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

    const { weekStartDate, preferences = {} } = req.body;
    const userId = req.user._id;

    // Calculate week end date
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Get user preferences
    const userPreferences = {
      dietaryPreferences: req.user.dietaryPreferences || [],
      allergies: req.user.allergies || [],
      nutritionGoals: req.user.nutritionGoals || {},
      maxPrepTime: req.user.preferences?.maxPrepTime || 60,
      maxCookTime: req.user.preferences?.maxCookTime || 120,
      preferredCuisines: req.user.preferences?.preferredCuisines || [],
      difficulty: req.user.preferences?.difficulty || ['easy', 'medium'],
      budget: req.user.budget || 100
    };

    // Merge with request preferences
    const finalPreferences = { ...userPreferences, ...preferences };

    // Generate meal plan using AI logic
    const mealPlan = await generateMealPlan(userId, startDate, endDate, finalPreferences);

    res.json({
      success: true,
      message: 'Meal plan generated successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('AI meal plan generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating meal plan'
    });
  }
});

// @route   POST /api/ai/suggest-recipes
// @desc    Get AI-suggested recipes based on preferences
// @access  Private
router.post('/suggest-recipes', auth, [
  body('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  body('maxPrepTime')
    .optional()
    .isInt({ min: 5, max: 300 })
    .withMessage('Max prep time must be between 5 and 300 minutes'),
  body('maxCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max cost must be a positive number')
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

    const { mealType, maxPrepTime, maxCost } = req.body;
    const userId = req.user._id;

    // Build query based on user preferences and filters
    const query = buildRecipeQuery(req.user, { mealType, maxPrepTime, maxCost });
    
    // Get suggested recipes
    const recipes = await Recipe.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      message: 'Recipes suggested successfully',
      data: recipes
    });
  } catch (error) {
    console.error('AI recipe suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error suggesting recipes'
    });
  }
});

// @route   POST /api/ai/analyze-nutrition
// @desc    Analyze nutrition of a meal plan
// @access  Private
router.post('/analyze-nutrition', auth, [
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

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId })
      .populate('meals.recipe');

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    // Analyze nutrition
    const analysis = analyzeMealPlanNutrition(mealPlan, req.user.nutritionGoals);

    res.json({
      success: true,
      message: 'Nutrition analysis completed',
      data: analysis
    });
  } catch (error) {
    console.error('Nutrition analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing nutrition'
    });
  }
});

// Helper function to generate meal plan
async function generateMealPlan(userId, startDate, endDate, preferences) {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
  const meals = [];

  // Get available recipes based on preferences
  const query = buildRecipeQuery({}, preferences);
  const availableRecipes = await Recipe.find(query);

  if (availableRecipes.length === 0) {
    throw new Error('No recipes found matching your preferences');
  }

  // Generate meals for each day
  for (const dayOfWeek of daysOfWeek) {
    for (const mealType of mealTypes) {
      // Skip snacks for some days to avoid overeating
      if (mealType === 'snack' && Math.random() < 0.3) continue;

      // Find suitable recipe for this meal type
      const suitableRecipes = availableRecipes.filter(recipe => {
        // Simple logic - in a real app, this would be more sophisticated
        return recipe.difficulty !== 'hard' || Math.random() < 0.3;
      });

      if (suitableRecipes.length > 0) {
        const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)];
        const servings = mealType === 'snack' ? 1 : (mealType === 'breakfast' ? 1 : 2);

        meals.push({
          name: randomRecipe.name,
          type: mealType,
          dayOfWeek,
          recipe: randomRecipe._id,
          servings,
          calories: Math.round((randomRecipe.nutrition.calories / randomRecipe.servings) * servings),
          cost: Math.round((randomRecipe.cost / randomRecipe.servings) * servings * 100) / 100
        });
      }
    }
  }

  // Create meal plan
  const mealPlan = new MealPlan({
    userId,
    weekStartDate: startDate,
    weekEndDate: endDate,
    meals,
    generatedBy: 'ai',
    preferences: {
      dietaryRestrictions: preferences.dietaryPreferences,
      maxPrepTime: preferences.maxPrepTime,
      maxCost: preferences.budget,
      preferredCuisines: preferences.preferredCuisines
    }
  });

  await mealPlan.save();
  return mealPlan;
}

// Helper function to build recipe query
function buildRecipeQuery(user, filters = {}) {
  const query = { isPublic: true };

  // Dietary preferences
  if (user.dietaryPreferences && user.dietaryPreferences.length > 0) {
    query.dietaryTags = { $in: user.dietaryPreferences };
  }

  // Allergies (exclude recipes with these ingredients)
  if (user.allergies && user.allergies.length > 0) {
    query.$and = user.allergies.map(allergy => ({
      'ingredients.name': { $not: { $regex: allergy, $options: 'i' } }
    }));
  }

  // Meal type (this would need to be stored in recipe or determined by name/ingredients)
  if (filters.mealType) {
    // Simple keyword matching - in real app, this would be more sophisticated
    const mealTypeKeywords = {
      breakfast: ['toast', 'cereal', 'pancake', 'waffle', 'egg', 'yogurt', 'smoothie'],
      lunch: ['salad', 'sandwich', 'soup', 'wrap', 'bowl'],
      dinner: ['pasta', 'rice', 'chicken', 'beef', 'fish', 'roast', 'grilled'],
      snack: ['nuts', 'fruit', 'crackers', 'cheese', 'trail mix']
    };

    if (mealTypeKeywords[filters.mealType]) {
      query.$or = mealTypeKeywords[filters.mealType].map(keyword => ({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      }));
    }
  }

  // Time constraints
  if (filters.maxPrepTime) {
    query.prepTime = { $lte: filters.maxPrepTime };
  }

  // Cost constraints
  if (filters.maxCost) {
    query.cost = { $lte: filters.maxCost };
  }

  return query;
}

// Helper function to analyze meal plan nutrition
function analyzeMealPlanNutrition(mealPlan, userGoals) {
  const totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  };

  // Calculate total nutrition from all meals
  mealPlan.meals.forEach(meal => {
    if (meal.recipe && meal.recipe.nutrition) {
      const scaleFactor = meal.servings / meal.recipe.servings;
      totalNutrition.calories += meal.recipe.nutrition.calories * scaleFactor;
      totalNutrition.protein += meal.recipe.nutrition.protein * scaleFactor;
      totalNutrition.carbs += meal.recipe.nutrition.carbs * scaleFactor;
      totalNutrition.fat += meal.recipe.nutrition.fat * scaleFactor;
      totalNutrition.fiber += meal.recipe.nutrition.fiber * scaleFactor;
    }
  });

  // Calculate daily averages
  const dailyNutrition = {
    calories: Math.round(totalNutrition.calories / 7),
    protein: Math.round(totalNutrition.protein / 7),
    carbs: Math.round(totalNutrition.carbs / 7),
    fat: Math.round(totalNutrition.fat / 7),
    fiber: Math.round(totalNutrition.fiber / 7)
  };

  // Compare with user goals
  const analysis = {
    dailyNutrition,
    weeklyNutrition: totalNutrition,
    goals: userGoals,
    recommendations: []
  };

  // Generate recommendations
  if (dailyNutrition.calories < userGoals.calories * 0.9) {
    analysis.recommendations.push('Consider adding more calorie-dense foods to meet your daily calorie goal');
  } else if (dailyNutrition.calories > userGoals.calories * 1.1) {
    analysis.recommendations.push('Consider reducing portion sizes or choosing lower-calorie options');
  }

  if (dailyNutrition.protein < userGoals.protein * 0.9) {
    analysis.recommendations.push('Add more protein-rich foods like lean meats, beans, or dairy');
  }

  if (dailyNutrition.fiber < userGoals.fiber * 0.9) {
    analysis.recommendations.push('Include more fiber-rich foods like whole grains, fruits, and vegetables');
  }

  return analysis;
}

module.exports = router;
