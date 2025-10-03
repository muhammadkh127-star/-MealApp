#!/bin/bash

# Personalized Meal Planning & Grocery App Setup Script
echo "🍽️  Setting up Personalized Meal Planning & Grocery App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
}

# Check if MongoDB is installed
check_mongodb() {
    print_status "Checking MongoDB installation..."
    if command -v mongod &> /dev/null; then
        print_success "MongoDB is installed"
    else
        print_warning "MongoDB is not installed. You can:"
        print_status "1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
        print_status "2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas"
        print_status "3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo"
    fi
}

# Install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    if npm install; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    cd backend
    if npm install; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    cd ..
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        print_success "Environment file created: backend/.env"
        print_warning "Please edit backend/.env with your configuration"
    else
        print_warning "Environment file already exists: backend/.env"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p src/components
    mkdir -p src/screens
    mkdir -p src/navigation
    mkdir -p src/services
    mkdir -p src/types
    mkdir -p src/utils
    mkdir -p src/store
    print_success "Directories created successfully"
}

# Main setup function
main() {
    echo "=========================================="
    echo "🍽️  Personalized Meal Planning & Grocery App"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_node
    check_mongodb
    echo ""
    
    # Create directories
    create_directories
    echo ""
    
    # Install dependencies
    install_frontend
    echo ""
    install_backend
    echo ""
    
    # Setup environment
    setup_env
    echo ""
    
    # Final instructions
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Edit backend/.env with your configuration"
    echo "2. Start MongoDB (if using local installation)"
    echo "3. Start the backend server:"
    echo "   cd backend && npm run dev"
    echo "4. Start the React Native app:"
    echo "   npm start"
    echo "5. Run on iOS: npm run ios"
    echo "   Run on Android: npm run android"
    echo ""
    echo "For more information, see README.md"
    echo "=========================================="
}

# Run main function
main
