const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    maxlength: [100, 'Recipe name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Image URL must be a valid image link'
    }
  },
  prepTime: {
    type: Number,
    required: [true, 'Prep time is required'],
    min: [0, 'Prep time cannot be negative']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cook time is required'],
    min: [0, 'Cook time cannot be negative']
  },
  servings: {
    type: Number,
    required: [true, 'Servings is required'],
    min: [1, 'Servings must be at least 1'],
    max: [20, 'Servings cannot exceed 20']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['easy', 'medium', 'hard']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine is required'],
    enum: ['american', 'italian', 'mexican', 'asian', 'mediterranean', 'indian', 'french', 'thai', 'chinese', 'japanese', 'korean', 'middle-eastern', 'other']
  },
  dietaryTags: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'pescatarian', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein', 'high-fiber', 'low-fat', 'low-sodium', 'sugar-free']
  }],
  ingredients: [{
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Ingredient amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'piece', 'slice', 'clove', 'pinch', 'dash', 'handful']
    },
    notes: {
      type: String,
      maxlength: [100, 'Notes cannot be more than 100 characters']
    }
  }],
  instructions: [{
    type: String,
    required: [true, 'Instructions are required'],
    trim: true
  }],
  nutrition: {
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative']
    },
    protein: {
      type: Number,
      required: [true, 'Protein is required'],
      min: [0, 'Protein cannot be negative']
    },
    carbs: {
      type: Number,
      required: [true, 'Carbs are required'],
      min: [0, 'Carbs cannot be negative']
    },
    fat: {
      type: Number,
      required: [true, 'Fat is required'],
      min: [0, 'Fat cannot be negative']
    },
    fiber: {
      type: Number,
      default: 0,
      min: [0, 'Fiber cannot be negative']
    },
    sugar: {
      type: Number,
      default: 0,
      min: [0, 'Sugar cannot be negative']
    },
    sodium: {
      type: Number,
      default: 0,
      min: [0, 'Sodium cannot be negative']
    }
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    enum: ['user', 'ai', 'imported'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Index for search functionality
recipeSchema.index({
  name: 'text',
  description: 'text',
  'ingredients.name': 'text',
  dietaryTags: 1,
  cuisine: 1,
  difficulty: 1
});

// Method to calculate nutrition per serving
recipeSchema.methods.getNutritionPerServing = function() {
  const nutrition = {};
  Object.keys(this.nutrition).forEach(key => {
    nutrition[key] = Math.round(this.nutrition[key] / this.servings);
  });
  return nutrition;
};

// Method to scale recipe
recipeSchema.methods.scaleRecipe = function(newServings) {
  const scaleFactor = newServings / this.servings;
  const scaledRecipe = this.toObject();
  
  scaledRecipe.ingredients = this.ingredients.map(ingredient => ({
    ...ingredient,
    amount: Math.round(ingredient.amount * scaleFactor * 100) / 100
  }));
  
  Object.keys(scaledRecipe.nutrition).forEach(key => {
    scaledRecipe.nutrition[key] = Math.round(scaledRecipe.nutrition[key] * scaleFactor);
  });
  
  scaledRecipe.servings = newServings;
  scaledRecipe.cost = Math.round(scaledRecipe.cost * scaleFactor * 100) / 100;
  
  return scaledRecipe;
};

module.exports = mongoose.model('Recipe', recipeSchema);
