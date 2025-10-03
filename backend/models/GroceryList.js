const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['produce', 'meat-seafood', 'dairy', 'grains', 'bakery', 'pantries', 'frozen', 'beverages', 'snacks', 'other']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'piece', 'slice', 'clove', 'pinch', 'dash', 'handful', 'bag', 'box', 'can', 'bottle']
  },
  estimatedCost: {
    type: Number,
    required: [true, 'Estimated cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  actualCost: {
    type: Number,
    min: [0, 'Actual cost cannot be negative']
  },
  isChecked: {
    type: Boolean,
    default: false
  },
  isPurchased: {
    type: Boolean,
    default: false
  },
  recipeIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  store: {
    name: String,
    location: String,
    aisle: String
  }
});

const groceryListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  mealPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan',
    required: [true, 'Meal plan ID is required']
  },
  name: {
    type: String,
    required: [true, 'List name is required'],
    trim: true,
    maxlength: [100, 'List name cannot be more than 100 characters']
  },
  items: [groceryItemSchema],
  totalEstimatedCost: {
    type: Number,
    default: 0,
    min: [0, 'Total cost cannot be negative']
  },
  totalActualCost: {
    type: Number,
    default: 0,
    min: [0, 'Total actual cost cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'shopping', 'completed', 'cancelled'],
    default: 'draft'
  },
  shoppingDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  store: {
    name: String,
    location: String,
    website: String
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
groceryListSchema.index({ userId: 1, status: 1 });
groceryListSchema.index({ mealPlanId: 1 });

// Pre-save middleware to calculate totals
groceryListSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalEstimatedCost = this.items.reduce((total, item) => total + item.estimatedCost, 0);
    this.totalActualCost = this.items.reduce((total, item) => total + (item.actualCost || 0), 0);
  }
  next();
});

// Method to get items by category
groceryListSchema.methods.getItemsByCategory = function() {
  const categories = {};
  this.items.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });
  return categories;
};

// Method to get unchecked items
groceryListSchema.methods.getUncheckedItems = function() {
  return this.items.filter(item => !item.isChecked);
};

// Method to get checked items
groceryListSchema.methods.getCheckedItems = function() {
  return this.items.filter(item => item.isChecked);
};

// Method to add item to list
groceryListSchema.methods.addItem = function(itemData) {
  this.items.push(itemData);
  return this.save();
};

// Method to remove item from list
groceryListSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId);
  return this.save();
};

// Method to update item
groceryListSchema.methods.updateItem = function(itemId, updateData) {
  const item = this.items.id(itemId);
  if (item) {
    Object.assign(item, updateData);
  }
  return this.save();
};

// Method to check/uncheck item
groceryListSchema.methods.toggleItemCheck = function(itemId) {
  const item = this.items.id(itemId);
  if (item) {
    item.isChecked = !item.isChecked;
  }
  return this.save();
};

// Method to check all items
groceryListSchema.methods.checkAllItems = function() {
  this.items.forEach(item => {
    item.isChecked = true;
  });
  return this.save();
};

// Method to uncheck all items
groceryListSchema.methods.uncheckAllItems = function() {
  this.items.forEach(item => {
    item.isChecked = false;
  });
  return this.save();
};

// Method to clear checked items
groceryListSchema.methods.clearCheckedItems = function() {
  this.items = this.items.filter(item => !item.isChecked);
  return this.save();
};

// Method to generate shopping list from meal plan
groceryListSchema.statics.generateFromMealPlan = async function(mealPlanId, userId) {
  const MealPlan = mongoose.model('MealPlan');
  const Recipe = mongoose.model('Recipe');
  
  const mealPlan = await MealPlan.findById(mealPlanId).populate('meals.recipe');
  if (!mealPlan) {
    throw new Error('Meal plan not found');
  }

  const groceryItems = [];
  const ingredientMap = new Map();

  // Aggregate ingredients from all meals
  mealPlan.meals.forEach(meal => {
    if (meal.recipe && meal.recipe.ingredients) {
      meal.recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        const scaledAmount = ingredient.amount * meal.servings;
        
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key);
          existing.quantity += scaledAmount;
          existing.estimatedCost += (ingredient.amount * meal.cost / meal.recipe.servings);
          existing.recipeIds.push(meal.recipe._id);
        } else {
          ingredientMap.set(key, {
            name: ingredient.name,
            category: 'other', // This would need to be determined by ingredient name
            quantity: scaledAmount,
            unit: ingredient.unit,
            estimatedCost: (ingredient.amount * meal.cost / meal.recipe.servings),
            recipeIds: [meal.recipe._id]
          });
        }
      });
    }
  });

  // Convert map to array
  ingredientMap.forEach((value, key) => {
    groceryItems.push(value);
  });

  // Create grocery list
  const groceryList = new this({
    userId,
    mealPlanId,
    name: `Grocery List - ${mealPlan.weekStartDate.toDateString()}`,
    items: groceryItems,
    status: 'draft'
  });

  return await groceryList.save();
};

module.exports = mongoose.model('GroceryList', groceryListSchema);
