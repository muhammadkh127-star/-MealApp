const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  dietaryPreferences: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'pescatarian', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein', 'mediterranean', 'whole30', 'raw-food']
  }],
  allergies: [{
    type: String,
    enum: ['nuts', 'dairy', 'gluten', 'soy', 'eggs', 'shellfish', 'fish', 'sesame', 'sulfites', 'none']
  }],
  nutritionGoals: {
    calories: {
      type: Number,
      default: 2000,
      min: [500, 'Calories must be at least 500'],
      max: [5000, 'Calories cannot exceed 5000']
    },
    protein: {
      type: Number,
      default: 150,
      min: [0, 'Protein cannot be negative']
    },
    carbs: {
      type: Number,
      default: 250,
      min: [0, 'Carbs cannot be negative']
    },
    fat: {
      type: Number,
      default: 65,
      min: [0, 'Fat cannot be negative']
    },
    fiber: {
      type: Number,
      default: 25,
      min: [0, 'Fiber cannot be negative']
    }
  },
  budget: {
    type: Number,
    default: 100,
    min: [0, 'Budget cannot be negative']
  },
  preferences: {
    maxPrepTime: {
      type: Number,
      default: 60,
      min: [5, 'Max prep time must be at least 5 minutes']
    },
    maxCookTime: {
      type: Number,
      default: 120,
      min: [5, 'Max cook time must be at least 5 minutes']
    },
    preferredCuisines: [{
      type: String,
      enum: ['american', 'italian', 'mexican', 'asian', 'mediterranean', 'indian', 'french', 'thai', 'chinese', 'japanese', 'korean', 'middle-eastern']
    }],
    difficulty: [{
      type: String,
      enum: ['easy', 'medium', 'hard']
    }]
  },
  notifications: {
    mealReminders: {
      type: Boolean,
      default: true
    },
    groceryReminders: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
