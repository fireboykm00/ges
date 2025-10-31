#!/bin/bash

echo "=========================================="
echo "GES Backend Server"
echo "=========================================="

# Ask which profile to use
echo "Select database profile:"
echo "  1) H2 (in-memory) [Default]"
echo "  2) MySQL"
read -p "Enter choice [1-2]: " choice

PROFILE="h2"
if [ "$choice" = "2" ]; then
    PROFILE="default"
fi

echo ""
echo "Starting backend with '$PROFILE' profile..."
echo "=========================================="
echo ""

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE
