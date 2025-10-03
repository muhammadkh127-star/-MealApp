#!/bin/bash

echo "🍽️  Setting up MongoDB for Meal Planning App..."

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

# Check if MongoDB is already installed
if command -v mongod &> /dev/null; then
    print_success "MongoDB is already installed"
    mongod --version
else
    print_status "MongoDB not found. Installing..."
    
    # Try to install with Homebrew
    if command -v brew &> /dev/null; then
        print_status "Installing MongoDB with Homebrew..."
        brew tap mongodb/brew
        brew install mongodb-community
        brew services start mongodb/brew/mongodb-community
        print_success "MongoDB installed and started with Homebrew"
    else
        print_warning "Homebrew not found. Please install MongoDB manually:"
        print_status "1. Download MongoDB from: https://www.mongodb.com/try/download/community"
        print_status "2. Follow installation instructions for macOS"
        print_status "3. Start MongoDB service"
        exit 1
    fi
fi

# Create data directory
print_status "Creating MongoDB data directory..."
mkdir -p ~/data/db

# Start MongoDB
print_status "Starting MongoDB..."
mongod --dbpath ~/data/db --fork --logpath ~/mongodb.log

# Wait a moment for MongoDB to start
sleep 3

# Test connection
print_status "Testing MongoDB connection..."
if mongosh --eval "db.runCommand('ping')" &> /dev/null; then
    print_success "MongoDB is running and accessible!"
else
    print_warning "MongoDB might not be running. Try starting it manually:"
    print_status "mongod --dbpath ~/data/db"
fi

# Update backend .env file
print_status "Updating backend configuration..."
cd /Users/muhammadkhan/MealPlanningApp/backend

cat > .env << 'ENVEOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/mealplanning

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

print_success "Backend configuration updated for local MongoDB"

echo ""
print_success "MongoDB setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Start the backend server:"
echo "   cd /Users/muhammadkhan/MealPlanningApp/backend"
echo "   npm start"
echo ""
echo "2. Start the frontend app:"
echo "   cd /Users/muhammadkhan/MealPlanningExpo"
echo "   npm start"
echo ""
echo "3. Your app will now connect to local MongoDB!"
