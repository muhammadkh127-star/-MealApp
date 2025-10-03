// App Constants
export const APP_NAME = 'Meal Planning App';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';
export const API_TIMEOUT = 10000;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Dietary Preferences
export const DIETARY_PREFERENCES = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'high-protein', label: 'High-Protein' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'whole30', label: 'Whole30' },
  { value: 'raw-food', label: 'Raw Food' },
] as const;

// Allergies
export const ALLERGIES = [
  { value: 'nuts', label: 'Nuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'soy', label: 'Soy' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'fish', label: 'Fish' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'sulfites', label: 'Sulfites' },
  { value: 'none', label: 'None' },
] as const;

// Cuisines
export const CUISINES = [
  { value: 'american', label: 'American' },
  { value: 'italian', label: 'Italian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'asian', label: 'Asian' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'indian', label: 'Indian' },
  { value: 'french', label: 'French' },
  { value: 'thai', label: 'Thai' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'middle-eastern', label: 'Middle Eastern' },
] as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const;

// Meal Types
export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
] as const;

// Days of Week
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const;

// Grocery Categories
export const GROCERY_CATEGORIES = [
  { value: 'produce', label: 'Produce', icon: 'local-grocery-store' },
  { value: 'meat-seafood', label: 'Meat & Seafood', icon: 'restaurant' },
  { value: 'dairy', label: 'Dairy', icon: 'local-drink' },
  { value: 'grains', label: 'Grains', icon: 'grain' },
  { value: 'bakery', label: 'Bakery', icon: 'cake' },
  { value: 'pantries', label: 'Pantry', icon: 'kitchen' },
  { value: 'frozen', label: 'Frozen', icon: 'ac-unit' },
  { value: 'beverages', label: 'Beverages', icon: 'local-drink' },
  { value: 'snacks', label: 'Snacks', icon: 'cookie' },
  { value: 'other', label: 'Other', icon: 'shopping-cart' },
] as const;

// Units
export const UNITS = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'l', label: 'Liters (l)' },
  { value: 'cup', label: 'Cup' },
  { value: 'tbsp', label: 'Tablespoon (tbsp)' },
  { value: 'tsp', label: 'Teaspoon (tsp)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'piece', label: 'Piece' },
  { value: 'slice', label: 'Slice' },
  { value: 'clove', label: 'Clove' },
  { value: 'pinch', label: 'Pinch' },
  { value: 'dash', label: 'Dash' },
  { value: 'handful', label: 'Handful' },
  { value: 'bag', label: 'Bag' },
  { value: 'box', label: 'Box' },
  { value: 'can', label: 'Can' },
  { value: 'bottle', label: 'Bottle' },
] as const;

// Colors
export const COLORS = {
  primary: '#2E7D32',
  primaryContainer: '#C8E6C9',
  secondary: '#FF6F00',
  secondaryContainer: '#FFE0B2',
  surface: '#FFFFFF',
  background: '#F5F5F5',
  error: '#D32F2F',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onSurface: '#000000',
  onBackground: '#000000',
  onError: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Font Sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 200,
  MAX_PREP_TIME: 300,
  MAX_COOK_TIME: 300,
  MAX_SERVINGS: 20,
  MAX_RATING: 5,
  MIN_RATING: 1,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 6 characters long.',
  INVALID_EMAIL: 'Please enter a valid email address.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MEAL_PLAN_CREATED: 'Meal plan created successfully!',
  RECIPE_SAVED: 'Recipe saved successfully!',
  GROCERY_LIST_GENERATED: 'Grocery list generated successfully!',
  ITEM_ADDED: 'Item added successfully!',
  ITEM_UPDATED: 'Item updated successfully!',
  ITEM_DELETED: 'Item deleted successfully!',
} as const;
