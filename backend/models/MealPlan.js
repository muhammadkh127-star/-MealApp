const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  dayOfWeek: {
    type: Number,
    required: [true, 'Day of week is required'],
    min: [0, 'Day must be 0-6'],
    max: [6, 'Day must be 0-6']
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: [true, 'Recipe is required']
  },
  servings: {
    type: Number,
    required: [true, 'Servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  calories: {
    type: Number,
    required: [true, 'Calories are required'],
    min: [0, 'Calories cannot be negative']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  }
});

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  weekStartDate: {
    type: Date,
    required: [true, 'Week start date is required']
  },
  weekEndDate: {
    type: Date,
    required: [true, 'Week end date is required']
  },
  meals: [mealSchema],
  totalCalories: {
    type: Number,
    default: 0,
    min: [0, 'Total calories cannot be negative']
  },
  totalCost: {
    type: Number,
    default: 0,
    min: [0, 'Total cost cannot be negative']
  },
  nutritionSummary: {
    protein: {
      type: Number,
      default: 0,
      min: [0, 'Protein cannot be negative']
    },
    carbs: {
      type: Number,
      default: 0,
      min: [0, 'Carbs cannot be negative']
    },
    fat: {
      type: Number,
      default: 0,
      min: [0, 'Fat cannot be negative']
    },
    fiber: {
      type: Number,
      default: 0,
      min: [0, 'Fiber cannot be negative']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  generatedBy: {
    type: String,
    enum: ['user', 'ai', 'template'],
    default: 'user'
  },
  preferences: {
    dietaryRestrictions: [String],
    maxPrepTime: Number,
    maxCost: Number,
    preferredCuisines: [String]
  }
}, {
  timestamps: true
});

// Index for efficient queries
mealPlanSchema.index({ userId: 1, weekStartDate: 1 });
mealPlanSchema.index({ userId: 1, isActive: 1 });

// Pre-save middleware to calculate totals
mealPlanSchema.pre('save', function(next) {
  if (this.meals && this.meals.length > 0) {
    this.totalCalories = this.meals.reduce((total, meal) => total + meal.calories, 0);
    this.totalCost = this.meals.reduce((total, meal) => total + meal.cost, 0);
    
    // Calculate nutrition summary (this would need to be populated with recipe data)
    this.nutritionSummary = {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };
  }
  next();
});

// Method to get meals for a specific day
mealPlanSchema.methods.getMealsForDay = function(dayOfWeek) {
  return this.meals.filter(meal => meal.dayOfWeek === dayOfWeek);
};

// Method to get meals by type
mealPlanSchema.methods.getMealsByType = function(type) {
  return this.meals.filter(meal => meal.type === type);
};

// Method to calculate daily nutrition
mealPlanSchema.methods.getDailyNutrition = function(dayOfWeek) {
  const dayMeals = this.getMealsForDay(dayOfWeek);
  return dayMeals.reduce((total, meal) => ({
    calories: total.calories + meal.calories,
    cost: total.cost + meal.cost
  }), { calories: 0, cost: 0 });
};

// Method to add meal to plan
mealPlanSchema.methods.addMeal = function(mealData) {
  this.meals.push(mealData);
  return this.save();
};

// Method to remove meal from plan
mealPlanSchema.methods.removeMeal = function(mealId) {
  this.meals = this.meals.filter(meal => meal._id.toString() !== mealId);
  return this.save();
};

// Method to update meal in plan
mealPlanSchema.methods.updateMeal = function(mealId, updateData) {
  const meal = this.meals.id(mealId);
  if (meal) {
    Object.assign(meal, updateData);
  }
  return this.save();
};

module.exports = mongoose.model('MealPlan', mealPlanSchema);
