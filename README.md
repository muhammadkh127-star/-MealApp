# Personalized Meal Planning & Grocery App

A comprehensive mobile application that provides personalized meal planning, smart grocery list generation, and recipe management to help users save time, reduce food waste, and make healthy eating easier.

## Features

### V1 Core Features
- **Personalized Meal Planning**: AI-generated meal plans based on diet, allergies, and nutrition goals
- **Smart Grocery Lists**: Auto-created shopping lists from chosen meal plans with check-off functionality
- **Recipe Management**: Comprehensive recipe database with step-by-step instructions and serving size adjustments
- **Budget & Time Management**: Set grocery budgets and filter meals by prep/cook time
- **Multi-language Support**: English + additional languages for global reach
- **Clean, Intuitive UI**: Modern mobile interface with excellent UX

### Target Users
- People with dietary needs (vegan, keto, gluten-free, etc.)
- Busy individuals who want quick, organized meal planning
- Budget and health-conscious users

## Tech Stack

### Frontend (Mobile)
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type safety and better development experience
- **React Navigation** - Navigation between screens
- **React Native Paper** - Material Design components
- **React Native Vector Icons** - Icon library
- **Axios** - HTTP client for API calls

### Backend (API)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Express Validator** - Input validation
- **Bcryptjs** - Password hashing

## Project Structure

```
MealPlanningApp/
├── src/                          # React Native source code
│   ├── components/               # Reusable components
│   ├── screens/                  # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── MealPlanScreen.tsx
│   │   ├── GroceryListScreen.tsx
│   │   ├── RecipesScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/               # Navigation configuration
│   ├── services/                 # API services
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   └── App.tsx                   # Main app component
├── backend/                      # Backend API
│   ├── models/                   # Database models
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   ├── MealPlan.js
│   │   └── GroceryList.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── recipes.js
│   │   ├── mealPlans.js
│   │   ├── groceryLists.js
│   │   └── ai.js
│   ├── middleware/               # Custom middleware
│   ├── config/                   # Configuration files
│   └── server.js                 # Main server file
└── package.json                  # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- React Native development environment
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MealPlanningApp
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the React Native app**
   ```bash
   # In the root directory
   npm start
   # Then run on iOS or Android
   npm run ios
   # or
   npm run android
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/verify-token` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `PUT /api/users/preferences` - Update user preferences
- `PUT /api/users/notifications` - Update notification settings

### Recipes
- `GET /api/recipes` - Get recipes with filtering
- `GET /api/recipes/:id` - Get specific recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/rate` - Rate recipe

### Meal Plans
- `GET /api/meal-plans` - Get user's meal plans
- `GET /api/meal-plans/:id` - Get specific meal plan
- `POST /api/meal-plans` - Create new meal plan
- `PUT /api/meal-plans/:id` - Update meal plan
- `DELETE /api/meal-plans/:id` - Delete meal plan
- `POST /api/meal-plans/:id/meals` - Add meal to plan
- `DELETE /api/meal-plans/:id/meals/:mealId` - Remove meal from plan

### Grocery Lists
- `GET /api/grocery-lists` - Get user's grocery lists
- `GET /api/grocery-lists/:id` - Get specific grocery list
- `POST /api/grocery-lists` - Create new grocery list
- `POST /api/grocery-lists/generate` - Generate list from meal plan
- `PUT /api/grocery-lists/:id` - Update grocery list
- `DELETE /api/grocery-lists/:id` - Delete grocery list

### AI Features
- `POST /api/ai/generate-meal-plan` - Generate AI meal plan
- `POST /api/ai/suggest-recipes` - Get AI recipe suggestions
- `POST /api/ai/analyze-nutrition` - Analyze meal plan nutrition

## Database Schema

### User Model
- Personal information (name, email, password)
- Dietary preferences and allergies
- Nutrition goals and budget
- App preferences and notifications

### Recipe Model
- Recipe details (name, description, instructions)
- Ingredients with quantities and units
- Nutrition information
- Difficulty, cuisine, and dietary tags
- Cost and rating information

### MealPlan Model
- Weekly meal planning structure
- Individual meals with recipes
- Nutrition and cost calculations
- User preferences and generation method

### GroceryList Model
- Shopping list items with categories
- Cost tracking (estimated vs actual)
- Check-off functionality
- Store and shopping information

## Development Roadmap

### V1 (Current)
- [x] Basic app structure and navigation
- [x] User authentication and profiles
- [x] Recipe management system
- [x] Meal planning interface
- [x] Grocery list generation
- [x] Basic AI meal planning
- [ ] Testing and bug fixes
- [ ] App store deployment

### Future Versions
- Advanced AI meal planning with machine learning
- Integration with grocery store APIs
- Social features and recipe sharing
- Nutrition tracking and analytics
- Meal prep and cooking timers
- Voice commands and smart home integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mealplanningapp.com or join our Discord community.

## Acknowledgments

- React Native community for excellent documentation
- MongoDB for the flexible database solution
- All contributors who help make this project better
