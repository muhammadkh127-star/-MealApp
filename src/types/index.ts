// User and Profile Types
export interface User {
  id: string;
  email: string;
  name: string;
  dietaryPreferences: DietaryPreference[];
  allergies: string[];
  nutritionGoals: NutritionGoals;
  budget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DietaryPreference {
  id: string;
  name: string;
  type: 'diet' | 'restriction' | 'preference';
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

// Meal Planning Types
export interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: Date;
  meals: Meal[];
  totalCalories: number;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  mealPlanId: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  recipe: Recipe;
  servings: number;
  calories: number;
  cost: number;
}

// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietaryTags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// Grocery List Types
export interface GroceryList {
  id: string;
  userId: string;
  mealPlanId: string;
  items: GroceryItem[];
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  isChecked: boolean;
  recipeIds: string[];
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation Types
export type RootTabParamList = {
  Home: undefined;
  MealPlan: undefined;
  GroceryList: undefined;
  Recipes: undefined;
  Profile: undefined;
};

// Filter and Search Types
export interface MealPlanFilters {
  dietaryPreferences: string[];
  maxPrepTime: number;
  maxCost: number;
  cuisine: string[];
  difficulty: string[];
}

export interface RecipeFilters {
  dietaryTags: string[];
  maxPrepTime: number;
  maxCookTime: number;
  difficulty: string[];
  cuisine: string[];
  maxCost: number;
}
