#!/bin/bash

echo "🍽️  Setting up MongoDB Atlas for Meal Planning App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Setting up MongoDB Atlas connection..."

# Update backend .env file for Atlas
cd /Users/muhammadkhan/MealPlanningApp/backend

cat > .env << 'ENVEOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas (Cloud) - Replace with your connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mealplanning?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Client URL
CLIENT_URL=http://localhost:3000

# AI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key-here

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ENVEOF

print_success "Backend configuration updated for MongoDB Atlas"

echo ""
print_success "MongoDB Atlas setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Go to https://www.mongodb.com/atlas"
echo "2. Create a free account"
echo "3. Create a new cluster"
echo "4. Get your connection string"
echo "5. Replace the MONGODB_URI in backend/.env with your connection string"
echo ""
echo "Example connection string:"
echo "mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/mealplanning?retryWrites=true&w=majority"
echo ""
echo "6. Start the backend server:"
echo "   cd /Users/muhammadkhan/MealPlanningApp/backend"
echo "   npm start"
echo ""
echo "7. Start the frontend app:"
echo "   cd /Users/muhammadkhan/MealPlanningExpo"
echo "   npm start"
