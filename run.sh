#!/bin/bash

echo "=========================================="
echo "GES Restaurant Stock Management System"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm not found. Installing pnpm...${NC}"
    npm install -g pnpm
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}⚠️  Maven not found. Please install Maven first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Maven found${NC}"
echo -e "${GREEN}✓ pnpm found${NC}"
echo ""

# Ask which database to use
echo "Select database to use:"
echo "  1) H2 (in-memory, no setup required) [Recommended for testing]"
echo "  2) MySQL (requires MySQL server running)"
read -p "Enter choice [1-2]: " db_choice

DB_PROFILE="h2"
if [ "$db_choice" = "2" ]; then
    DB_PROFILE="default"
    echo ""
    echo "Setting up MySQL database..."
    
    # Check if MySQL is running
    if command -v mysql &> /dev/null; then
        echo "Creating database if it doesn't exist..."
        mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ges;" 2>/dev/null || {
            echo -e "${YELLOW}⚠️  Please ensure MySQL is running and credentials are correct.${NC}"
            echo "   Edit backend/src/main/resources/application.properties if needed."
        }
    else
        echo -e "${RED}⚠️  MySQL client not found. Using H2 instead.${NC}"
        DB_PROFILE="h2"
    fi
fi

echo ""
echo -e "${GREEN}Using ${DB_PROFILE} database profile${NC}"
echo ""

# Install frontend dependencies if needed
echo "Checking frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "  Running pnpm install (this may take a moment)..."
    pnpm install
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi
cd ..

echo ""
echo "=========================================="
echo "Starting services..."
echo "=========================================="
echo ""

# Start backend
echo "Starting backend server in new terminal..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=$DB_PROFILE; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=$DB_PROFILE; exec bash" &
else
    echo -e "${YELLOW}⚠️  No terminal emulator found. Please run manually:${NC}"
    echo "   cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=$DB_PROFILE"
fi

# Wait a moment for backend to initialize
sleep 3

# Start frontend
echo ""
echo "Starting frontend server in new terminal..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd frontend && pnpm dev; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "cd frontend && pnpm dev; exec bash" &
else
    echo -e "${YELLOW}⚠️  No terminal emulator found. Please run manually:${NC}"
    echo "   cd frontend && pnpm dev"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Application started successfully!${NC}"
echo "=========================================="
echo ""
echo "Backend API:  http://localhost:8080/api"
echo "Swagger UI:   http://localhost:8080/swagger-ui"
if [ "$DB_PROFILE" = "h2" ]; then
    echo "H2 Console:   http://localhost:8080/h2-console"
    echo "              JDBC URL: jdbc:h2:mem:gesdb"
    echo "              User: sa"
    echo "              Password: (leave empty)"
fi
echo "Frontend:     http://localhost:3000"
echo ""
echo "Default Login Credentials:"
echo "  Email: admin@ges.com"
echo "  Password: admin123"
echo ""
echo "To stop the servers:"
echo "  pkill -f spring-boot:run"
echo "  pkill -f vite"
echo "Or simply close the terminal windows."
echo "=========================================="
